import { loadProblems } from './loader';

let problemCache = null;

export async function mapProblems() {
  const problemList = await loadProblems();
  problemCache = problemList.reduce((map, problem) => {
    map.set(problem.name, problem);
    return map;
  }, new Map());
  return problemCache;
}

export function getProblems() {
  return problemCache;
}

export function getProblem(name) {
  return problemCache.get(name);
}
