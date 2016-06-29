create type registration_mode as enum ('open', 'code', 'preset');
create type submission_result as enum ('successful', 'failed_tests', 'bad_compile', 'crashed', 'timeout', 'internal_error');

create table if not exists contests (
    id serial primary key,
    title text not null,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    mode registration_mode not null default 'code',
    code text,
    problems text[] not null default array[]::text[]
);

create table if not exists users (
    id serial primary key,
    contest_id integer not null,
    participant_number integer not null,
    name text,
    password text,
    problems_completed text[] not null default array[]::text[],
    time_score integer not null default 0,
    problem_scores jsonb not null default '{}'::jsonb,
    meta jsonb,

    unique (contest_id, participant_number)
);

-- problem_scores: {
--   ProblemName: [12345, 600, 600, ...],
--   ...
-- }

create table if not exists submissions (
    id serial primary key,
    user_id integer not null,
    contest_id integer not null,
    problem text not null,
    answer text not null,
    submission_time timestamp with time zone not null default now(),
    time_score integer,
    result submission_result,
    meta jsonb
);
