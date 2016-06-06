use rustc_serialize::json;
use testers::get_tester_for_language;
use testers::base::Tester;

#[derive(RustcDecodable, Debug)]
pub struct Submission {
    user: u32,
    problem: String,
    answer: String,
}

impl Submission {
    pub fn parse(encoded: String) -> Submission {
        json::decode(&encoded).unwrap() // XXX unwrap
    }

    pub fn get_tester(&self) -> Option<Box<Tester>> {
        // TODO: support multiple languages in the future
        get_tester_for_language("java")
    }

    pub fn get_problem_name(&self) -> String {
        self.problem.clone()
    }

    pub fn get_answer(&self) -> String {
        self.answer.clone()
    }
}
