use std::error::Error;
use std::fs::File;
use std::io::Write;
use std::os::unix::process::ExitStatusExt;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use problems::{Problem};
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
    fn build(&mut self, input: String, problem: &Problem) -> Result<SubmissionResult, Box<Error>> {
        let filename = format!("{}.java", self.problem);
        let target = self.workdir.as_path().join(&filename);

        // write the input to file
        {
            debug!("Writing input to {}", &target.display());
            let mut f = try!(File::create(&target));
            try!(f.write_all(&input.as_bytes()));
        }

        // compile it
        debug!("Launching javac (compiling)");
        let out = try!(Command::new("javac").arg("Runner.java").arg(&filename)
            .current_dir(&self.workdir)
            .output());
        if !out.status.success() {
            error!("{}", String::from_utf8_lossy(&out.stderr));
            return Ok(SubmissionResult::BadCompile);
        }

        // create a shell script to run it in its sandbox
        try!(self.build_shell_script(&problem));
        Ok(SubmissionResult::Successful)
    }

    // TODO: return test diffs
    fn test(&mut self, testdata: String) -> Result<SubmissionResult, Box<Error>> {
        debug!("Launching testing script");
        let out = try!(Command::new("contest-exec")
                               .arg(self.workdir.as_os_str())
                               .arg("5")
                               // TODO: once https://github.com/rust-lang/rust/issues/31398
                               // is implemented, use that replacement inside contest-exec
                               .arg("/usr/bin/setsid")
                               .arg("/bin/sh").arg("test.sh")
                               .output());
        let stdout = String::from_utf8_lossy(&out.stdout);
        let stderr = String::from_utf8_lossy(&out.stderr);
        trace!("stderr:\n{}", stderr);
        trace!("stdout:\n{}", stdout);
        if !out.status.success() {
            warn!("Exited unsuccessfully");
            match out.status.code() {
                Some(222) => {
                    warn!("Killed (timeout)");
                    return Ok(SubmissionResult::Timeout);
                },
                _ => {},
            }
            return Ok(SubmissionResult::Crashed);
        }
        debug!("Execution finished; checking diff output");

        // scan stdout for pass/fail messages
        let mut pass = 0;
        let mut fail = 0;
        for line in stdout.split('\n') {
            match line.trim() {
                "#PASS#" => pass += 1,
                "#FAIL#" => fail += 1,
                _ => (),
            }
        }
        if fail > 0 {
            debug!("Failed {}, passed {}", fail, pass);
            return Ok(SubmissionResult::FailedTests{pass: pass, fail: fail, diff: stderr.to_string()});
        }

        debug!("Passed all {} tests", pass);
        Ok(SubmissionResult::Successful)
    }
}

impl JavaTester {
    fn build_shell_script(&self, problem: &Problem) -> Result<(), Box<Error>> {
        let test_dir = problem.get_test_dir();
        let test_path = test_dir.to_string_lossy();
        let mut sub: Vec<String> = vec![];
        for test in &problem.get_tests() {
            sub.push(format!("java Runner < {path}/{test}.in > {test}.actual\n\
                              status=$?\n\
                              [ $status -eq 0 ] || exit $status\n\
                              diff -Bbu --label {test}.expected {path}/{test}.out {test}.actual >&2\n\
                              [ $? -eq 0 ] && echo '#PASS#' || echo '#FAIL#'",
                test=test, path=test_path));
        }

        let script = format!("#!/bin/sh\n\n{}", sub.join("\n\n"));
        trace!("script:\n{}", script);

        let mut f = try!(File::create(&self.workdir.as_path().join("test.sh")));
        try!(f.write_all(script.as_bytes()));

        Ok(())
    }
}
