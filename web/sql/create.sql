create table contest (
    id serial primary key,
    title text not null,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    problems text[]
);

create table user (
    id serial primary key,
    contest integer not null,
    participant_number integer not null,
    name text,
    password text
);

-- TODO: submissions table
