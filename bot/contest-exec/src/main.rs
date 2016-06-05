extern crate libc;
extern crate rand;
extern crate walkdir;

mod util;

use std::env;
use std::error::Error;
use std::os::unix::fs::MetadataExt;
use std::path::Path;
use std::process::{Command, exit};
use std::ptr::null;
use libc::{geteuid, setgid, setgroups, setuid};
use rand::random;
use util::{Lock, OwnedDir};

const PREFIX: &'static str = "/var/tmp/progcon-";
const LOCK_PREFIX: &'static str = "/var/tmp/progconuser-";
const MIN_UID: u32 = 20000;

fn main() {
    // find out what we're working with
    let mut args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        println!("usage: contest-exec {}workingdir command", PREFIX);
        exit(1);
    }
    let workdir = args[1].clone();
    let command = args[2].clone();
    let args = args.split_off(3);

    // be safe!
    sanity_check(&workdir);

    // pick a random uid; "reserve" it with a lock file
    let lock = pick_uid().unwrap();

    // wrapping up errors; save them for later (cleanup) instead of panicing
    su_exec(Path::new(&workdir), lock.uid, command, &args).unwrap();
}

fn sanity_check(workdir: &str) {
    // gotta be root
    let uid = unsafe { geteuid() };
    if uid != 0 {
        panic!("must be run root (setuid root)");
    }

    // ensure dir matches prefix
    if !workdir.starts_with(PREFIX) {
        panic!("given workdir doesn't start with {} ({})", PREFIX, workdir);
    }

    // ensure dir exists
    if !Path::new(workdir).exists() {
        panic!("workdir {} doesn't exist", workdir);
    }
}

fn pick_uid() -> Result<Lock, Box<Error>> {
    let mut uid;
    let mut name;
    loop {
        uid = MIN_UID + random::<u16>() as u32;
        name = format!("{}{}.lock", LOCK_PREFIX, uid);
        let path = Path::new(&name);

        if !path.exists() {
            break;
        }

        // if the lock file isn't actually owned by the user we expect,
        // then something isn't right -- remove the lock and claim it anyway.
        let metadata = try!(path.metadata());
        let lock_uid = metadata.uid();
        if lock_uid != uid {
            break;
        }
    }

    let path = Path::new(&name);
    Lock::new(path, uid)
}

fn su_exec(workdir: &Path, uid: u32, command: String, args: &Vec<String>) -> Result<(), Box<Error>> {
    // claim our working directory
    // Drop will delete the directory
    let _owned = OwnedDir::new(workdir, uid);

    // time to drop to our user
    unsafe {
        if setgroups(0, null()) != 0 {
            return Err(From::from("couldn't drop groups".to_string()));
        }
        if setgid(uid) != 0 {
            return Err(From::from("couldn't setgid".to_string()));
        }
        if setuid(uid) != 0 {
            return Err(From::from("couldn't setuid".to_string()));
        }
    }

    // chdir to it
    try!(env::set_current_dir(&workdir));

    // run it!
    let mut run = try!(Command::new(command).args(args).spawn());
    try!(run.wait());

    Ok(())
}
