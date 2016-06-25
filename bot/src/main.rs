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
use std::error::Error;
use nanomsg::{Socket, Protocol};
use problems::ProblemLibrary;
use response::Response;
use submission::Submission;

fn main() {
    env_logger::init().unwrap();

    let mut socket_commands = Socket::new(Protocol::Rep).unwrap();
    let mut _endpoint_commands = socket_commands.bind("ipc:///tmp/progcon-bot_commands.ipc").expect("couldn't bind to endpoint");

    let mut library = ProblemLibrary::new();

    // TODO: make this configurable
    let library_path = current_dir().unwrap().join("../sample-problems");
    library.scan_dir(library_path.as_path()).expect("error scanning directory");

    info!("Started up. Listening for commands.");

    loop {
        let mut msg = String::new();
        if let Err(e) = socket_commands.read_to_string(&mut msg) {
            error!("Socket read error: {}", e);
            continue;
        }

        let resp = match handle_message(&msg, &library) {
            Ok(s) => s,
            Err(e) => Response::new_error(e.description().to_string()).encode().unwrap(),
        };

        if let Err(e) = socket_commands.write_all(resp.as_bytes()) {
            error!("Socket write error: {}", e);
            continue;
        }
    }
}

fn handle_message(msg: &str, library: &ProblemLibrary) -> Result<String, Box<Error>> {
    // read in the submission
    let sub = try!(Submission::parse(msg));
    trace!("{:?}", sub);

    // load the problem
    let problem = library.get_problem_from_submission(&sub);
    match problem {
        Some(p) => {
            // grade it
            let result = p.test_submission(&sub);
            if !result.is_ok() {
                let msg = result.unwrap_err();
                error!("bug: {}", msg);
                return Err(msg);
            }

            let resp = Response::new(&sub, result.unwrap());
            let encoded = try!(resp.encode());
            Ok(encoded)
        },
        None => {
            Err(From::from("invalid problem"))
        },
    }
}
