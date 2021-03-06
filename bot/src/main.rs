/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

#[macro_use]
extern crate log;
#[macro_use]
extern crate serde_derive;

extern crate env_logger;
extern crate nanomsg;
extern crate serde;
extern crate serde_json;
extern crate tempdir;
extern crate toml;

mod problems;
mod response;
mod submission;
mod testers;

use std::io::{Read, Write};
use std::env::{self, current_dir};
use std::error::Error;
use std::process::exit;
use nanomsg::{Socket, Protocol};
use problems::ProblemLibrary;
use response::Response;
use submission::Submission;

fn main() {
    env_logger::init().unwrap();

    let mut args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        println!("usage: progcon-bot socket_path problem_dir [problem_dir...]");
        exit(1);
    }
    let socket_path = args[1].clone();
    let problem_dirs = args.split_off(2);

    let mut socket_commands = Socket::new(Protocol::Rep).unwrap();
    let mut _endpoint_commands = socket_commands
        .bind(&socket_path)
        .expect("couldn't bind to endpoint");

    let mut library = ProblemLibrary::new();

    // scan all given directories for problems
    for dir in problem_dirs {
        info!("Scanning {}", dir);
        let library_path = current_dir().unwrap().join(dir);
        library
            .scan_dir(library_path.as_path())
            .expect("error scanning directory");
    }

    info!("Started up. Listening for commands.");

    loop {
        let mut msg = String::new();
        if let Err(e) = socket_commands.read_to_string(&mut msg) {
            error!("Socket read error: {}", e);
            continue;
        }
        trace!(">>> {}", msg);

        let resp = match handle_message(&msg, &library) {
            Ok(s) => s,
            Err(e) => {
                Response::new_error(e.description().to_string())
                    .encode()
                    .unwrap()
            }
        };
        trace!("<<< {}", resp);

        if let Err(e) = socket_commands.write_all(resp.as_bytes()) {
            error!("Socket write error: {}", e);
            continue;
        }
    }
}

fn handle_message(msg: &str, library: &ProblemLibrary) -> Result<String, Box<Error>> {
    // read in the submission
    let sub = try!(Submission::parse(msg));
    info!("Running submission {} (user {}, problem {})",
          sub.get_id(),
          sub.get_user(),
          sub.get_problem_name());

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
            info!("Result: {:?}", resp.get_status());

            let encoded = try!(resp.encode());
            Ok(encoded)
        }
        None => {
            warn!("Invalid problem");
            Err(From::from("invalid problem"))
        }
    }
}
