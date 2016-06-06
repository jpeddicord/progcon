use std::collections::HashMap;
use std::error::Error;
use std::fs::{File, read_dir};
use std::io::Read;
use std::path::Path;
use toml;
use submission::Submission;

pub struct ProblemLibrary {
    problems: HashMap<String, Box<Problem>>,
}

impl ProblemLibrary {
    pub fn new() -> ProblemLibrary {
        ProblemLibrary {
            problems: HashMap::new(),
        }
    }

    pub fn scan_dir(&mut self, dir: &Path) -> Result<(), Box<Error>> {
        for entry in try!(read_dir(dir)) {
            let e = try!(entry);
            let path = e.path();
            if !path.is_dir() {
                continue;
            }

            self.load_problem(&path);
        }
        Ok(())
    }

    pub fn load_problem(&mut self, path: &Path) -> Result<(), Box<Error>> {
        let name = path.file_name().unwrap().to_str().unwrap(); // XXX oh god

        // load up the problem spec
        let mut f = try!(File::open(path.join("problem.toml")));
        let mut s = String::new();
        try!(f.read_to_string(&mut s));
        let val = toml::Parser::new(&s).parse().unwrap(); // XXX unwrap

        // build a problem struct
        let problem = Box::new(Problem::new(name.to_string()));
        self.problems.insert(name.to_string(), problem);
        println!("loaded problem {}", name);
        Ok(())
    }

    pub fn get_problem(&self, name: String) -> Option<&Box<Problem>> {
        self.problems.get(&name)
    }

    pub fn get_problem_from_submission(&self, sub: &Submission) -> Option<&Box<Problem>> {
        self.problems.get(&sub.get_problem_name())
    }
}

struct Problem {
    name: String,
}

impl Problem {
    fn new(name: String) -> Problem {
        Problem {
            name: name,
        }
    }

    pub fn test_submission(&self, sub: &Submission) -> Result<(), Box<Error>> {
        let mut tester = sub.get_tester().unwrap(); // XXX unwrap
        tester.build(sub.get_answer());
        tester.test(String::new()); // TODO
        Ok(())
    }
}
