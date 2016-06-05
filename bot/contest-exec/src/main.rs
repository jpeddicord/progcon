extern crate libc;
extern crate rand;

use std::env;
use std::ffi::CString;
use std::fs;
use std::path::Path;
use libc::{chmod, chown, geteuid, setgid, setuid};
use rand::random;

const BASE_RUN_DIR: &'static str = "/var/tmp/progcon";
const MIN_UID: u32 = 20000;

fn main() {
    // sanity check
    let uid = unsafe { geteuid() };
    if uid != 0 {
        panic!("must be run root (setuid root)");
    }

    let base = Path::new(BASE_RUN_DIR);

    // make sure our working dir is there
    fs::create_dir_all(base).unwrap();

    // sticky allows users to delete their own directories and clean up after themselves,
    // but not other users' files. this is similar to how /tmp works.
    unsafe {
        let base_ptr = CString::new(BASE_RUN_DIR).unwrap().as_ptr();
        chmod(base_ptr, 0o1777);
    }

    // pick a random uid
    let mut uid;
    let mut working;
    loop {
        uid = MIN_UID + random::<u16>() as u32;
        println!("chose {}", uid);

        // check if that directory already exists; if it does then it's likely
        // in use by another runner.
        working = base.join(uid.to_string());
        if !working.exists() {
            break;
        }
    }

    // give it a working dir
    fs::create_dir(&working).unwrap();
    unsafe {
        let working_ptr = CString::new(working.to_str().unwrap()).unwrap().as_ptr();
        chown(working_ptr, uid, uid);
    }

    // time to drop to our user
    // XXX don't panic, need to clean up afterwards
    unsafe {
        if setgid(uid) != 0 {
            panic!("couldn't setgid");
        }
        if setuid(uid) != 0 {
            panic!("couldn't setuid");
        }
    }

    // chdir to it
    env::set_current_dir(&working);

    let newuid = unsafe { geteuid() };
    println!("i'm now {}", newuid);

    // TODO: run the thing

    fs::remove_dir_all(&working).unwrap();
}
