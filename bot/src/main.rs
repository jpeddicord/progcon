extern crate nanomsg;
extern crate rustc_serialize;
extern crate toml;

mod problems;
mod submission;
mod testers;

use std::io::{Read, Write};
use std::path::Path;
use nanomsg::{Socket, Protocol, Error};
use problems::ProblemLibrary;
use submission::Submission;

fn main() {
    let mut socket_events = Socket::new(Protocol::Pub).unwrap();
    let mut endpoint_events = socket_events.bind("ipc:///tmp/progcon-bot_events.ipc").unwrap();

    let mut socket_commands = Socket::new(Protocol::Rep).unwrap();
    let mut endpoint_commands = socket_commands.bind("ipc:///tmp/progcon-bot_commands.ipc").unwrap();

    let mut library = ProblemLibrary::new();
    library.scan_dir(Path::new("../sample-problems"));

    println!("Started up. Listening for commands.");

    loop {
        let mut msg = String::new();
        socket_commands.read_to_string(&mut msg).unwrap();

        let sub = Submission::parse(msg);
        println!("{:?}", sub);

        let problem = library.get_problem_from_submission(&sub); // XXX unwrap
        match problem {
            Some(p) => {
                p.test_submission(&sub);
            },
            None => {
                socket_commands.write(b"invalid problem");
                continue;
            },
        }

        match socket_commands.write_all(b"yay") {
            Ok(..) => println!("wahoo"),
            Err(err) => {
                println!("oh dear: {}", err)
            }
        }
    }

}
