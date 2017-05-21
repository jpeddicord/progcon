/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use serde_json::{self, Error};
use submission::Submission;

#[derive(Debug)]
pub struct SubmissionResult {
    pub status: SubmissionStatus,
    pub meta: SubmissionMeta,
}

impl SubmissionResult {
    pub fn new(status: SubmissionStatus) -> SubmissionResult {
        SubmissionResult {
            status,
            meta: SubmissionMeta::None,
        }
    }

    pub fn with_meta(status: SubmissionStatus, meta: SubmissionMeta) -> SubmissionResult {
        SubmissionResult { status, meta }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionStatus {
    Successful,
    FailedTests,
    BadCompile,
    Crashed,
    Timeout,
    InternalError,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum SubmissionMeta {
    None,
    GeneralFailure { stderr: String },
    TestFailures { pass: u8, fail: u8, diff: String },
    InternalError(String),
}

#[derive(Debug, Serialize)]
pub struct Response {
    id: u32,
    user: u32,
    problem: String,
    result: SubmissionStatus,
    meta: SubmissionMeta,
}

impl Response {
    pub fn new(sub: &Submission, result: SubmissionResult) -> Response {
        Response {
            id: sub.get_id(),
            user: sub.get_user(),
            problem: sub.get_problem_name(),
            result: result.status,
            meta: result.meta,
        }
    }

    pub fn new_error(msg: String) -> Response {
        Response {
            id: 0,
            user: 0,
            problem: String::new(),
            result: SubmissionStatus::InternalError,
            meta: SubmissionMeta::InternalError(msg),
        }
    }

    pub fn encode(&self) -> Result<String, Error> {
        serde_json::to_string(&self)
    }

    pub fn get_status(&self) -> &SubmissionStatus {
        &self.result
    }
}
