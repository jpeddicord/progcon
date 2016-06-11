pub mod base;
pub mod java;

use std::path::Path;
use testers::base::Tester;

pub fn new_tester(problem: &str, lang: &str, workdir: &Path) -> Option<Box<Tester>> {
    match lang {
        "java" => Some(Box::new(java::JavaTester::new(problem, workdir))),
        _ => None,
    }
}
