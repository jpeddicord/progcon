/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use std::collections::HashMap;
use std::error::Error;
use std::fs::{File, copy, read_dir};
use std::io::Read;
use std::path::{Path, PathBuf};
use toml;
use response::SubmissionResult;
use submission::Submission;
use testers::base::set_up_workdir;

pub struct ProblemLibrary {
    problems: HashMap<String, Box<Problem>>,
}

impl ProblemLibrary {
    pub fn new() -> ProblemLibrary {
        ProblemLibrary { problems: HashMap::new() }
    }

    pub fn scan_dir(&mut self, dir: &Path) -> Result<(), Box<Error>> {
        for entry in try!(read_dir(dir)) {
            let e = try!(entry);
            let path = e.path();
            if !path.is_dir() {
                continue;
            }

            try!(self.load_problem(&path));
        }
        Ok(())
    }

    pub fn load_problem(&mut self, path: &Path) -> Result<(), Box<Error>> {
        let name = path.file_name().unwrap().to_str().unwrap();
        info!("Loading problem {}", name);

        // load up the problem spec
        let mut f = try!(File::open(path.join("problem.toml")));
        let mut s = String::new();
        try!(f.read_to_string(&mut s));
        // REVIEW: this is still unused, but should be in the future
        let _val = toml::Parser::new(&s).parse().expect("parsing error");

        // build a problem struct
        let problem = Box::new(Problem::new(name.to_string(), path));

        // put it in the library
        self.problems.insert(name.to_string(), problem);
        Ok(())
    }

    pub fn get_problem_from_submission(&self, sub: &Submission) -> Option<&Box<Problem>> {
        self.problems.get(&sub.get_problem_name())
    }
}

pub struct Problem {
    #[allow(dead_code)]
    name: String, // REVIEW: TBD; should be used by tester but isn't
    path: PathBuf,
    tests: Vec<String>,
}

impl Problem {
    fn new(name: String, path: &Path) -> Problem {
        let mut p = Problem {
            name: name,
            path: path.to_path_buf(),
            tests: vec![],
        };
        p.scan_tests().expect("problem scanning tests");
        p
    }

    pub fn get_test_dir(&self) -> PathBuf {
        self.path.join("tests")
    }

    fn scan_tests(&mut self) -> Result<(), Box<Error>> {
        for entry in try!(read_dir(self.get_test_dir())) {
            let e = try!(entry);
            let filename = e.file_name().to_str().unwrap().to_string();

            // only look for .in files; we'll check for .out when loading
            if filename.ends_with(".in") {
                let name = filename.trim_right_matches(".in");
                self.load_test(name);
            }
        }
        Ok(())
    }

    fn load_test(&mut self, name: &str) {
        let path = self.get_test_dir().join(format!("{}.out", name));
        if !path.exists() {
            panic!("test output file {} does not exist", path.display());
        }
        debug!("Added test {}", name);
        self.tests.push(name.to_string());
    }

    /// Copy files needed for a tester to run.
    /// REVIEW: This is not currently language-agnostic.
    pub fn copy_work_files(&self, workdir: &Path) -> Result<(), Box<Error>> {
        let src_runner = self.path.join("Runner.java");
        let dest_runner = workdir.join("Runner.java");
        try!(copy(src_runner, dest_runner));
        Ok(())
    }

    pub fn test_submission(&self, sub: &Submission) -> Result<SubmissionResult, Box<Error>> {
        // get the environment ready
        let workdir = try!(set_up_workdir());
        try!(self.copy_work_files(&workdir));
        let mut tester = match sub.get_tester(&workdir) {
            Some(t) => t,
            None => return Err(From::from("could not find tester for submission type")),
        };

        // compile...
        let compile_result = try!(tester.build(sub.get_answer(), self));
        if let SubmissionResult::BadCompile = compile_result {
            return Ok(compile_result);
        }

        // and test
        // REVIEW: pass in tests here, not during build step
        let test_result = try!(tester.test(String::new()));

        Ok(test_result)
    }

    pub fn get_tests(&self) -> Vec<String> {
        self.tests.clone()
    }
}
