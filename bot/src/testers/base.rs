use std::error::Error;

pub trait Tester {
    fn build(&mut self, input: String) -> Result<(), Box<Error>>;
    fn test(&mut self, testdata: String) -> Result<(), Box<Error>>;
}

pub fn set_up_workdir() {
    
}
