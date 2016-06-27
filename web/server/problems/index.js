/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import { loadProblems } from './loader';

let problemCache = null;

export async function mapProblems() {
  const problemList = await loadProblems();
  problemCache = problemList.reduce((map, problem) => {
    map.set(problem.get('name'), problem);
    return map;
  }, new Map());
  return problemCache;
}

export function getProblems() {
  return problemCache;
}

export function getProblem(name) {
  return problemCache.get(name).toJS();
}
