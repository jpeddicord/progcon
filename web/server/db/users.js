import db from './index';
import { contestSequence } from './contests';

export function getUser(id) {
  return db.one('select * from users where id = $1', [id]);
}

export function getContestUsers(contest) {
  return db.any('select id, participant_numer, name from users where contest_id = $1', [contest]);
}

export async function registerUser(name, password, contest) {
  // before you freak out about the password:
  // remember that these are session-based accounts. they're tied to a single,
  // time-limited contest. they're store as plaintext to proritize fast assistance
  // in case a participant gets locked out, and they're randomly-generated.

  const user = await db.one(
    'insert into users(name, password, contest_id, participant_number) values($1, $2, $3, nextval($4)) returning id',
    [name, password, contest, contestSequence(contest)],
  );
  return user.id;
}

// update the user's score, optionally adding a problem to their completed list
export function updateScore(id, timeScore, problem) {
  if (problem != null) {
    return db.none(
      'update users set (time_score, problems_completed) = (time_score + $2, array_append(problems_completed, $3)) where id = $1',
      [id, timeScore, problem],
    );
  } else {
    return db.none(
      'update users set (time_score) = (time_score + $2) where id = $1',
      [id, timeScore],
    );
  }
}
