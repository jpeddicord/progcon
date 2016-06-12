use std::error::Error;
use std::path::PathBuf;
use tempdir::TempDir;
use problems::{Problem};
use response::SubmissionResult;

const WORKDIR_TEMP: &'static str = "/var/tmp/";
const WORKDIR_PREFIX: &'static str = "progcon-submission";

pub trait Tester {
    fn build(&mut self, input: String, problem: &Problem) -> Result<SubmissionResult, Box<Error>>;
    fn test(&mut self, testdata: String) -> Result<SubmissionResult, Box<Error>>;
}

pub fn set_up_workdir() -> Result<PathBuf, Box<Error>> {
    let dir = try!(TempDir::new_in(WORKDIR_TEMP, WORKDIR_PREFIX));
    Ok(dir.into_path())
}
