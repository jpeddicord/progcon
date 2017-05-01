/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use std::error::Error;
use std::ffi::CString;
use std::fs::{File, remove_file, remove_dir_all};
use std::path::{Path, PathBuf};
use libc::chown;
use walkdir::WalkDir;

pub fn own_path(path: &Path, uid: u32) -> Result<(), Box<Error>> {
    let path_str = match path.to_str() {
        Some(s) => s,
        None => return Err(From::from(format!("empty CString from path {}", path.display()))),
    };
    unsafe {
        let path_ptr = try!(CString::new(path_str)).as_ptr();
        if chown(path_ptr, uid, uid) != 0 {
            return Err(From::from(format!("chown failed on path {}", path.display())));
        }
    }
    Ok(())
}

pub fn own_dir(dir: &Path, uid: u32) -> Result<(), Box<Error>> {
    for entry in WalkDir::new(dir) {
        // there should never be any files that we can't chown here, but check anyway
        let e = try!(entry);
        try!(own_path(e.path(), uid));
    }
    Ok(())
}

pub struct Lock {
    path: PathBuf,
    pub uid: u32,
}

impl Lock {
    pub fn new(path: &Path, uid: u32) -> Result<Lock, Box<Error>> {
        try!(File::create(path));
        try!(own_path(path, uid));
        Ok(Lock {
               path: path.to_path_buf(),
               uid: uid,
           })
    }
}

impl Drop for Lock {
    fn drop(&mut self) {
        remove_file(self.path.as_path()).unwrap();
    }
}

pub struct OwnedDir {
    path: PathBuf,
}

impl OwnedDir {
    pub fn new(path: &Path, uid: u32) -> Result<OwnedDir, Box<Error>> {
        try!(own_dir(path, uid));
        Ok(OwnedDir { path: path.to_path_buf() })
    }
}

impl Drop for OwnedDir {
    fn drop(&mut self) {
        remove_dir_all(self.path.as_path()).unwrap();
    }
}
