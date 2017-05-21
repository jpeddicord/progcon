/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use std::collections::BTreeMap;
use serde_json::{self, Error, Map, Value};
use submission::Submission;

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionResult {
    Successful,
    FailedTests { pass: u8, fail: u8, diff: String },
    BadCompile,
    Crashed,
    Timeout,
    InternalError,
}

#[derive(Debug, Serialize)]
pub struct Response {
    id: u32,
    user: u32,
    problem: String,
    result: String,
    meta: Value,
}

impl Response {
    pub fn new(sub: &Submission, result: SubmissionResult) -> Response {
        let meta = match result {
            SubmissionResult::FailedTests {
                pass,
                fail,
                ref diff,
            } => {
                json!({
                    "pass": pass,
                    "fail": fail,
                    "diff": diff,
                })
            }
            _ => Value::Null,
        };

        Response {
            id: sub.get_id(),
            user: sub.get_user(),
            problem: sub.get_problem_name(),
            result: Response::result_string(&result),
            meta,
        }
    }

    pub fn new_error(msg: String) -> Response {
        Response {
            id: 0,
            user: 0,
            problem: String::new(),
            result: "internal_error".to_owned(),
            meta: Value::String(msg),
        }
    }

    pub fn encode(&self) -> Result<String, Error> {
        serde_json::to_string(&self)
    }

    pub fn result_string(result: &SubmissionResult) -> String {
        match *result {
            SubmissionResult::FailedTests{..} => "failed_tests".to_string(),
            _ => serde_json::to_string(&result).expect("could not serialize SubmissionResult"),
        }
    }

    pub fn get_result(&self) -> &str {
        &self.result
    }
}
