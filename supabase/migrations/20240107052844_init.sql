-- sqlfluff:max_line_length:0

CREATE TABLE leagues (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT
);
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

CREATE TABLE league_owners (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    league_id BIGINT REFERENCES leagues ON DELETE CASCADE NOT NULL
);
ALTER TABLE league_owners ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE league_owners IS 'owners of a league';

CREATE TABLE tournaments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    league_id BIGINT REFERENCES leagues ON DELETE CASCADE NOT NULL,
    name TEXT
);
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE TABLE teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP DEFAULT now(),
    name TEXT,
    join_code TEXT
);
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- users on a team
CREATE TABLE team_members (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    team_id BIGINT REFERENCES teams ON DELETE CASCADE NOT NULL
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE games (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tournament_id BIGINT REFERENCES tournaments ON DELETE CASCADE NOT NULL,

    created_at TIMESTAMP DEFAULT now(),
    started_at TIMESTAMP,

    current_round INT,
    current_round_position INT,

    category_bonus_enabled BOOLEAN,

    join_code TEXT
);
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
COMMENT ON COLUMN games.join_code IS 'team must enter join code every game to ensure that they are physically present';

CREATE TABLE team_games (
    game_id BIGINT REFERENCES games ON DELETE CASCADE NOT NULL,
    team_id BIGINT REFERENCES teams ON DELETE CASCADE NOT NULL
);
ALTER TABLE team_games ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE team_games IS 'games a team is participating in';

CREATE TABLE categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    league_id BIGINT REFERENCES leagues ON DELETE CASCADE NOT NULL,
    name TEXT
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
COMMENT ON COLUMN categories.league_id IS 'categories are scoped to leagues';

CREATE TABLE game_team_category_bonus (
    team_id BIGINT REFERENCES teams ON DELETE CASCADE NOT NULL,
    game_id BIGINT REFERENCES games ON DELETE CASCADE NOT NULL,
    category_id BIGINT REFERENCES categories ON DELETE CASCADE,
    UNIQUE (team_id, game_id)
);
ALTER TABLE game_team_category_bonus ENABLE ROW LEVEL SECURITY;

CREATE TABLE prompts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT REFERENCES categories ON DELETE CASCADE,
    question TEXT,
    answer TEXT
);
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE TABLE game_prompts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    prompt_id BIGINT REFERENCES prompts,
    game_id BIGINT REFERENCES games ON DELETE CASCADE,

    round INT NOT NULL,
    round_position INT NOT NULL,

    created_at TIMESTAMP DEFAULT now(),
    opened_at TIMESTAMP,
    closed_at TIMESTAMP,

    is_correct BOOLEAN DEFAULT FALSE,

    -- do not accept answers beyond this point
    closes_at TIMESTAMP
);
ALTER TABLE game_prompts ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE game_prompts IS 'instances of a prompt in an actual game';

CREATE TABLE responses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users,
    team_id BIGINT REFERENCES teams ON DELETE CASCADE,
    game_prompt_id BIGINT REFERENCES game_prompts,
    response TEXT
);
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
