use std::error::Error;
use std::ffi::CString;
use std::fs::{File, remove_file, remove_dir_all};
use std::path::{Path, PathBuf};
use libc::chown;

pub fn own_path(path: &Path, uid: u32) -> Result<(), Box<Error>> {
    let path_str = match path.to_str() {
        Some(s) => s,
        None => return Err(From::from("empty CString from path".to_string())),
    };
    unsafe {
        let path_ptr = try!(CString::new(path_str)).as_ptr();
        chown(path_ptr, uid, uid); // FIXME: check result
    }
    Ok(())

    // TODO: recurse for dirs? different method?
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
        remove_file(self.path.as_path());
    }
}

pub struct OwnedDir {
    path: PathBuf,
}

impl OwnedDir {
    pub fn new(path: &Path, uid: u32) -> Result<OwnedDir, Box<Error>> {
        try!(own_path(path, uid)); // XXX: own_dir?
        Ok(OwnedDir {
            path: path.to_path_buf(),
        })
    }
}

impl Drop for OwnedDir {
    fn drop(&mut self) {
        remove_dir_all(self.path.as_path());
    }
}
