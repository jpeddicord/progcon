create type registration_mode as enum ('open', 'code', 'preset');

create table contests (
    id serial primary key,
    title text not null,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    mode registration_mode not null default 'code',
    code text,
    problems text[] not null default array[]::text[]
);

create table users (
    id serial primary key,
    contest integer not null,
    participant_number integer not null,
    name text,
    password text
);

-- TODO: submissions table
