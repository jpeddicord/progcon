/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use std::collections::BTreeMap;
use std::error::Error;
use rustc_serialize::json::{self, ToJson, Json};
use submission::Submission;

#[derive(Debug)]
pub enum SubmissionResult {
    Successful,
    FailedTests { pass: u8, fail: u8, diff: String },
    BadCompile,
    Crashed,
    Timeout,
    InternalError,
}

impl ToJson for SubmissionResult {
    fn to_json(&self) -> Json {
        // this syntax doesn't feel right... but rustc complains without the prefixes
        let string = match *self {
            SubmissionResult::Successful => "successful",
            SubmissionResult::FailedTests { .. } => "failed_tests",
            SubmissionResult::BadCompile => "bad_compile",
            SubmissionResult::Crashed => "crashed",
            SubmissionResult::Timeout => "timeout",
            SubmissionResult::InternalError => "internal_error",
        };
        Json::String(string.to_string())
    }
}

#[derive(RustcEncodable, Debug)]
pub struct Response {
    id: u32,
    user: u32,
    problem: String,
    result: Json,
    meta: Json,
}

impl Response {
    pub fn new(sub: &Submission, result: SubmissionResult) -> Response {
        let meta = match result {
            SubmissionResult::FailedTests {
                pass,
                fail,
                ref diff,
            } => {
                let mut map = BTreeMap::new();
                map.insert("pass".to_string(), pass.to_json());
                map.insert("fail".to_string(), fail.to_json());
                map.insert("diff".to_string(), diff.to_json());
                Json::Object(map)
            }
            _ => Json::Null,
        };

        Response {
            id: sub.get_id(),
            user: sub.get_user(),
            problem: sub.get_problem_name(),
            result: result.to_json(),
            meta: meta,
        }
    }

    pub fn new_error(msg: String) -> Response {
        Response {
            id: 0,
            user: 0,
            problem: String::new(),
            result: SubmissionResult::InternalError.to_json(),
            meta: Json::String(msg),
        }
    }

    pub fn encode(&self) -> Result<String, Box<Error>> {
        match json::encode(&self) {
            Ok(s) => Ok(s),
            Err(e) => Err(Box::new(e)),
        }
    }

    pub fn get_result_string(&self) -> String {
        if let Json::String(ref s) = self.result {
            s.clone()
        } else {
            "unknown".to_string()
        }
    }
}
