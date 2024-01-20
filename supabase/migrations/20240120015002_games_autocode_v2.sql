ALTER TABLE games
DROP CONSTRAINT games_unique_join_code;

ALTER TABLE teams
DROP CONSTRAINT teams_unique_join_code;

-- these indexes tolerate lowercase
CREATE UNIQUE INDEX games_unique_join_code_idx ON games (LOWER(join_code));

CREATE UNIQUE INDEX teams_unique_join_code_idx ON teams (LOWER(join_code));
