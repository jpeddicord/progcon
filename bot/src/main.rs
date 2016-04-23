extern crate nanomsg;

mod testers;

use std::io::Read;
use nanomsg::{Socket, Protocol, Error};

fn main() {
    let mut socket_events = Socket::new(Protocol::Pub).unwrap();
    let mut endpoint_events = socket_events.bind("ipc:///tmp/progcon-bot_events.ipc").unwrap();

    let mut socket_commands = Socket::new(Protocol::Rep).unwrap();
    let mut endpoint_commands = socket_commands.bind("ipc:///tmp/progcon-bot_commands.ipc").unwrap();

    println!("Started up. Listening for commands.");

    loop {
        let mut msg = String::new();
        socket_commands.read_to_string(&mut msg).unwrap();
        println!(">>> {}", &*msg);
    }

}

// brainstorming here
fn accept_submission() {
    unimplemented!();

    // using mioco
    // 
}
