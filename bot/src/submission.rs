use rustc_serialize::json;

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
}
