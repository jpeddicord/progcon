use std::error::Error;
use testers::base::Tester;

pub struct JavaTester {
}

impl JavaTester {
    pub fn new() -> JavaTester {
        JavaTester {
        }
    }
}

impl Tester for JavaTester {
    fn build(&mut self, input: String) -> Result<(), Box<Error>> {
        println!("STUB: build");
        Ok(())
    }

    fn test(&mut self, testdata: String) -> Result<(), Box<Error>> {
        println!("STUB: test");
        Ok(())
    }
}
