INSERT INTO leagues ("name") VALUES ('alpha');

INSERT INTO tournaments ("league_id", "name") VALUES (1, 'alpha_alpha');
INSERT INTO tournaments ("league_id", "name") VALUES (1, 'alpha_beta');

-- id: 1
INSERT INTO teams ("name", "join_code") VALUES ('alpha', 'alpha');
-- id: 2
INSERT INTO teams ("name", "join_code") VALUES ('beta', 'beta');

-- id: 1
INSERT INTO categories ("league_id", "name") VALUES (1, 'alpha');
-- id: 1
INSERT INTO prompts ("category_id", "question", "answer") VALUES (
    1, 'alpha', 'alpha'
);
-- id: 2
INSERT INTO prompts ("category_id", "question", "answer") VALUES (
    1, 'beta', 'beta'
);

-- id: 1
INSERT INTO games (
    "tournament_id",
    "total_rounds",
    "total_round_positions",
    "join_code"
) VALUES (1, 1, 2, 'join_code');

-- id: 1
INSERT INTO game_prompts (
    "prompt_id", "game_id", "round", "round_position"
) VALUES (
    1, 1, 1, 1
);
-- id: 2
INSERT INTO game_prompts (
    "prompt_id", "game_id", "round", "round_position"
) VALUES (
    2, 1, 1, 2
);

-- simulate team alpha joining game 1
INSERT INTO team_games ("game_id", "team_id") VALUES (1, 1);

CALL testing.create_user(
    'player1@test.invalid', '00000000-0000-0000-0000-000000000001'
);
CALL testing.create_user(
    'player2@test.invalid', '00000000-0000-0000-0000-000000000002'
);
-- user 1 is on team 1 (alpha)
INSERT INTO team_members ("team_id", "user_id") VALUES (
    1, '00000000-0000-0000-0000-000000000001'
);
-- user 2 is on team 2 (beta)
INSERT INTO team_members ("team_id", "user_id") VALUES (
    2, '00000000-0000-0000-0000-000000000002'
);

-- user 3 owns the league 1 (alpha)
CALL testing.create_user(
    'owner1@test.invalid', '00000000-0000-0000-0000-000000000003'
);
INSERT INTO league_owners VALUES ('00000000-0000-0000-0000-000000000003', 1);
