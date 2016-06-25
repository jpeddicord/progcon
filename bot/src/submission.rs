use std::error::Error;
use std::path::Path;
use rustc_serialize::json;
use testers::new_tester;
use testers::base::Tester;

#[derive(RustcDecodable, Debug)]
pub struct Submission {
    id: u32,
    user: u32,
    problem: String,
    answer: String,
}

impl Submission {
    pub fn parse(encoded: &str) -> Result<Submission, Box<Error>> {
        match json::decode(encoded) {
            Ok(sub) => Ok(sub),
            Err(e) => Err(Box::new(e)),
        }
    }

    pub fn get_tester(&self, workdir: &Path) -> Option<Box<Tester>> {
        // REVIEW: support multiple languages in the future
        new_tester(self.problem.as_ref(), "java", workdir)
    }

    pub fn get_id(&self) -> u32 {
        self.id
    }

    pub fn get_user(&self) -> u32 {
        self.user
    }

    pub fn get_problem_name(&self) -> String {
        self.problem.clone()
    }

    pub fn get_answer(&self) -> String {
        self.answer.clone()
    }
}
