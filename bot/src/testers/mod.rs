/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

pub mod base;
pub mod java;

use std::path::Path;
use testers::base::Tester;

pub fn new_tester(problem: &str, lang: &str, workdir: &Path) -> Option<Box<Tester>> {
    match lang {
        "java" => Some(Box::new(java::JavaTester::new(problem, workdir))),
        _ => None,
    }
}
