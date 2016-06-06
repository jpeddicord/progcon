pub mod base;
pub mod java;

use testers::base::Tester;

pub fn get_tester_for_language(lang: &str) -> Option<Box<Tester>> {
    match lang {
        "java" => Some(Box::new(java::JavaTester::new())),
        _ => None,
    }
}
