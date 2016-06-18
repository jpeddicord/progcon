#![allow(dead_code)]
#![allow(unused_imports)]
#![allow(unused_variables)]
#![allow(unused_mut)]
// TODO: drop the above dead code things and clean stuff up!

extern crate env_logger;
#[macro_use] extern crate log;
extern crate nanomsg;
extern crate rustc_serialize;
extern crate tempdir;
extern crate toml;

mod problems;
mod response;
mod submission;
mod testers;

use std::io::{Read, Write};
use std::env::current_dir;
use std::path::Path;
use nanomsg::{Socket, Protocol, Error};
use problems::ProblemLibrary;
use response::Response;
use submission::Submission;

fn main() {
    env_logger::init().unwrap();

    let mut socket_commands = Socket::new(Protocol::Rep).unwrap();
    let mut endpoint_commands = socket_commands.bind("ipc:///tmp/progcon-bot_commands.ipc").unwrap();

    let mut library = ProblemLibrary::new();

    // TODO: make this configurable
    let library_path = current_dir().unwrap().join("../sample-problems");
    library.scan_dir(library_path.as_path()).unwrap();

    info!("Started up. Listening for commands.");

    loop {
        let mut msg = String::new();
        socket_commands.read_to_string(&mut msg).unwrap(); // XXX unwrap

        // read in the submission
        let sub = Submission::parse(msg);
        trace!("{:?}", sub);

        // load the problem
        let problem = library.get_problem_from_submission(&sub);
        match problem {
            Some(p) => {
                // grade it
                let result = p.test_submission(&sub);
                if !result.is_ok() {
                    let msg = format!("internal error: {}", result.unwrap_err());
                    error!("bug: {}", msg);
                    socket_commands.write_all(msg.as_bytes()).unwrap(); // XXX unwrap
                    continue
                }

                let resp = Response::new(&sub, result.unwrap());
                socket_commands.write_all(resp.encode().as_bytes()).unwrap(); // XXX unwrap
                continue;
            },
            None => {
                socket_commands.write_all(b"invalid problem").unwrap(); // XXX unwrap
                continue;
            },
        }
    }

}
