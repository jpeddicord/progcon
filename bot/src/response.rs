use rustc_serialize::Encodable;
use rustc_serialize::json::{self, ToJson, Json};
use submission::Submission;

#[derive(Debug)]
pub enum SubmissionResult {
    Successful,
    FailedTests(u8, u8),
    BadCompile,
    Crashed,
    Timeout,
    InternalError
}

impl ToJson for SubmissionResult {
    fn to_json(&self) -> Json {
        // this syntax doesn't feel right... but rustc complains witohut the prefixes
        let string = match *self {
            SubmissionResult::Successful => "successful",
            SubmissionResult::FailedTests(_, _) => "failed_tests",
            SubmissionResult::BadCompile => "bad_compile",
            SubmissionResult::Crashed => "crashed",
            SubmissionResult::Timeout => "timeout",
            SubmissionResult::InternalError => "internal_error",
        };
        Json::String(string.to_string())
    }
}

#[derive(RustcEncodable, Debug)]
pub struct Response {
    user: u32,
    problem: String,
    result: Json,
}

impl Response {
    pub fn new(sub: &Submission, result: SubmissionResult) -> Response {
        Response {
            user: sub.get_user(),
            problem: sub.get_problem_name(),
            result: result.to_json(),
        }
    }

    pub fn encode(&self) -> String {
        json::encode(&self).unwrap() // XXX unwrap
    }
}
