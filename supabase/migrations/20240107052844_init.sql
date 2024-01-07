-- sqlfluff:max_line_length:0

CREATE TABLE leagues (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
);

CREATE TABLE leagues_owners (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    league_id BIGINT REFERENCES leagues ON DELETE CASCADE
);

CREATE TABLE tournaments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    league_id BIGINT REFERENCES leagues ON DELETE CASCADE,
    name TEXT
);

CREATE TABLE teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    created_at TIMESTAMP DEFAULT now(),

    join_code TEXT
);

CREATE TABLE users_teams (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    team_id BIGINT REFERENCES teams ON DELETE CASCADE
);

CREATE TABLE games (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tournament_id BIGINT REFERENCES tournaments ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT now(),
    started_at TIMESTAMP,

    category_bonus_enabled BOOLEAN,

    join_code TEXT
);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT
);

CREATE TABLE games_teams_categories_bonus (
    team_id BIGINT REFERENCES teams ON DELETE CASCADE,
    game_id BIGINT REFERENCES games ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories ON DELETE CASCADE
);

CREATE TABLE prompts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT REFERENCES categories ON DELETE CASCADE,
    question TEXT,
    answer TEXT
);

CREATE TABLE prompt_instances (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    prompt_id BIGINT REFERENCES prompts,
    game_id BIGINT REFERENCES games ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT now(),
    opened_at TIMESTAMP,
    closes_at TIMESTAMP
);

CREATE TABLE responses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users,
    team_id BIGINT REFERENCES teams ON DELETE CASCADE,
    prompt_instance_id BIGINT REFERENCES prompt_instances,
    response TEXT
);
