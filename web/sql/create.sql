create type registration_mode as enum ('open', 'code', 'preset');
create type submission_result as enum ('successful', 'failed_test', 'bad_compile', 'crashed', 'timeout', 'internal_error');

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
    contest integer not null,
    participant_number integer not null,
    name text,
    password text,

    unique (contest, participant_number)
);
create index on users (contest, participant_number desc);

create table if not exists submissions (
    id serial primary key,
    user_id integer not null,
    contest integer not null,
    problem text not null,
    submission_time timestamp with time zone not null,
    time_score integer,
    result submission_result
);
