/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as fs from 'mz/fs';
import * as path from 'path';
import * as Immutable from 'immutable';
import * as toml from 'toml';
import * as winston from 'winston';
const { config } = require('../config');

export async function loadProblems() {
  winston.info(`Reading problems from ${config.problems.paths.length} paths`);
  let problems: any[] = []; // FIXME: define the real structure of this
  for (let path of config.problems.paths) {
    const p = await loadProblemsFromPath(path);
    problems = problems.concat(p);
  }
  winston.info(`Loaded ${problems.length} problems`);
  return problems;
}

async function loadProblemsFromPath(problemPath: string) {
  const files = await fs.readdir(problemPath);
  let problems = [];
  for (let name of files) {
    const problemDir = path.join(problemPath, name);
    const stat = await fs.stat(problemDir);
    if (!stat.isDirectory()) {
      continue;
    }
    const problem = await loadProblem(name, path.join(problemPath, name));
    problems.push(problem);
  }
  return problems;
}

async function loadProblem(name: string, dir: string) {
  const problemToml = path.join(dir, 'problem.toml');
  const data = await fs.readFile(problemToml, 'utf8');
  const info = toml.parse(data);

  const meta = {
    name,
    description: null as string | null,
    stub: null as string | null,
    stub_name: null as string | null,
  };

  // load the problem description for the website
  if (info.description != null) {
    const descPath = path.join(dir, info.description);
    const buf = await fs.readFile(descPath);
    meta.description = buf.toString();
  }
  // load the stub as well
  if (info.stub != null) {
    const stubPath = path.join(dir, info.stub);
    const buf = await fs.readFile(stubPath);
    meta.stub = buf.toString();
    meta.stub_name = info.stub;
  }

  winston.verbose(`Adding problem ${name}`);

  return Immutable.fromJS(meta);
}
