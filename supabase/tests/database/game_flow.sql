BEGIN;
SELECT plan(1);

-- wrap this in a function so we can set variables
CREATE OR REPLACE FUNCTION _test() RETURNS void
LANGUAGE plpgsql
AS $$
#variable_conflict use_variable
DECLARE
    _game "games";
    _game_prompt_id bigint;
    _response_id bigint;
    _score int;
BEGIN
    CALL auth.login_as_user('owner1@test.invalid');
    SELECT * INTO _game FROM generate_promptless_game(1, 3, 3);
    CALL auth.logout();

    CALL auth.login_as_user('player2@test.invalid');
    PERFORM join_game(2, _game.join_code);
    PERFORM FROM games WHERE id = _game.id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'cannot see game';
    END IF;
    CALL auth.logout();

    CALL auth.login_as_user('owner1@test.invalid');
    PERFORM advance_game(_game.id);
    PERFORM FROM game_prompts 
        WHERE game_id = _game.id AND round = 1 and round_position = 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'owner cannot see prompt';
    END IF;
    CALL auth.logout();

    CALL auth.login_as_user('player2@test.invalid');
    SELECT id INTO _game_prompt_id 
        FROM game_prompts 
        WHERE game_id = _game.id AND round = 1 and round_position = 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'player cannot see prompt';
    END IF;
    INSERT INTO responses ("team_id", "game_prompt_id", "answer")
        VALUES (2, _game_prompt_id, '42')
        RETURNING id INTO _response_id;
    CALL auth.logout();

    CALL auth.login_as_user('owner1@test.invalid');
    INSERT INTO response_scores ("response_id", "is_scored", "is_correct")
        VALUES (_response_id, TRUE, TRUE);

    SELECT score INTO _score FROM simple_scoreboard WHERE game_id = _game.id;
    IF _score < 0 THEN
        RAISE EXCEPTION 'bad game score %', _score;
    END IF;
    CALL auth.logout();
END;
$$;

SELECT lives_ok(
    'SELECT _test();'
);

ROLLBACK;
