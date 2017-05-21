/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

use std::path::Path;
use serde_json::{self, Error};
use testers::new_tester;
use testers::base::Tester;

#[derive(Debug, Deserialize)]
pub struct Submission {
    id: u32,
    user: u32,
    problem: String,
    answer: String,
}

impl Submission {
    pub fn parse(encoded: &str) -> Result<Submission, Error> {
        serde_json::from_str(encoded)
    }

    pub fn get_tester(&self, workdir: &Path) -> Option<Box<Tester>> {
        // REVIEW: support multiple languages in the future
        new_tester(self.problem.as_ref(), "java", workdir)
    }

    pub fn get_id(&self) -> u32 {
        self.id
    }

    pub fn get_user(&self) -> u32 {
        self.user
    }

    pub fn get_problem_name(&self) -> String {
        self.problem.clone()
    }

    pub fn get_answer(&self) -> String {
        self.answer.clone()
    }
}
