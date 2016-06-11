use std::error::Error;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use response::SubmissionResult;
use testers::base::Tester;

pub struct JavaTester {
    problem: String,
    workdir: PathBuf,
}

impl JavaTester {
    pub fn new(problem: &str, workdir: &Path) -> JavaTester {
        JavaTester {
            problem: problem.to_string(),
            workdir: workdir.to_path_buf(),
        }
    }
}

impl Tester for JavaTester {

    // TODO: return logs
    // TODO: compile errors should not be an Err here; return it as a successful
    // result. perhaps a nested result, or a different enum entirely
    fn build(&mut self, input: String) -> Result<SubmissionResult, Box<Error>> {
        println!("build step");
        let filename = format!("{}.java", self.problem);
        let target = self.workdir.as_path().join(&filename);

        // write the file
        {
            println!("writing to {}", &target.display());
            let mut f = try!(File::create(&target));
            try!(f.write_all(&input.as_bytes()));
        }

        println!("wrote");
        let out = try!(Command::new("javac").arg("Runner.java").arg(&filename)
            .current_dir(&self.workdir)
            .output());
        if !out.status.success() {
            println!("{}", String::from_utf8_lossy(&out.stderr));
            return Err(From::from("javac exited with an error (bad compile?)"))
        }
        Ok(SubmissionResult::Successful)
    }

    // TODO: return test diffs
    fn test(&mut self, testdata: String) -> Result<SubmissionResult, Box<Error>> {
        println!("STUB: test");
        Ok(SubmissionResult::Timeout)
    }
}
