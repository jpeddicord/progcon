/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

extern crate libc;
extern crate rand;
extern crate wait_timeout;
extern crate walkdir;

mod util;

use std::env;
use std::error::Error;
use std::os::unix::fs::MetadataExt;
use std::path::Path;
use std::process::{Command, exit};
use std::ptr::null;
use std::time::Duration;
use libc::{geteuid, kill, setgid, setgroups, setuid};
use rand::random;
use wait_timeout::ChildExt;
use util::{Lock, OwnedDir};

const PREFIX: &'static str = "/var/tmp/progcon-";
const LOCK_PREFIX: &'static str = "/var/tmp/progconuser-";
const MIN_UID: u32 = 20000;

fn main() {
    exit(real_main());
}

fn real_main() -> i32 {
    // find out what we're working with
    let mut args: Vec<String> = env::args().collect();
    if args.len() < 4 {
        println!("usage: contest-exec {}workingdir timeout_secs command",
                 PREFIX);
        return 1;
    }
    let workdir = args[1].clone();
    let timeout = args[2].clone().parse::<u8>().unwrap();
    let command = args[3].clone();
    let args = args.split_off(4);

    // be safe!
    sanity_check(&workdir);

    // pick a random uid; "reserve" it with a lock file
    let lock = pick_uid().unwrap();

    // wrapping up errors; save them for later (cleanup) instead of panicing
    let code = su_exec(Path::new(&workdir), lock.uid, timeout, command, &args).unwrap();
    match code {
        Some(c) => c,
        None => 222,
    }
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

fn su_exec(workdir: &Path,
           uid: u32,
           timeout: u8,
           command: String,
           args: &[String])
           -> Result<Option<i32>, Box<Error>> {
    // claim our working directory
    // Drop will delete the directory
    let _owned = OwnedDir::new(workdir, uid);

    // time to drop to our user
    unsafe {
        if setgroups(0, null()) != 0 {
            return Err(From::from("couldn't drop groups"));
        }
        if setgid(uid) != 0 {
            return Err(From::from("couldn't setgid"));
        }
        if setuid(uid) != 0 {
            return Err(From::from("couldn't setuid"));
        }
    }

    // chdir to it
    try!(env::set_current_dir(&workdir));

    // run it!
    let mut run = try!(Command::new(command).args(args).spawn());
    let pid = run.id() as i32;

    // wait up to the timeout
    match run.wait_timeout(Duration::new(timeout as u64, 0))
              .unwrap() {
        // exited on-time; pass the result up
        Some(status) => Ok(status.code()),
        // did not exit on time, so kill the process group
        None => {
            unsafe {
                kill(-pid, 9);
            }
            Ok(None)
        }
    }
}
