CREATE OR REPLACE FUNCTION advance_game(
    game_id bigint
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    _current_game RECORD;
    _current_game_prompt RECORD;
    _next_game_prompt RECORD;
    _is_beginning BOOLEAN DEFAULT FALSE;
BEGIN
    SELECT * INTO _current_game FROM games WHERE id = game_id AND game_id IN (SELECT private.get_games_for_league_owners());
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No game found with id %', game_id;
    END IF;

    IF _current_game.completed_at IS NOT NULL THEN
        RAISE EXCEPTION 'Game completed';
    END IF;

    UPDATE games
        SET advance_ctr = advance_ctr + 1
        WHERE id = _current_game.id;

    IF _current_game.started_at IS NULL THEN
        -- this is the first call
        UPDATE games
            SET started_at = CURRENT_TIMESTAMP,
                current_round = 1,
                round_position = 1
            WHERE id = _current_game.id;
        _is_beginning := TRUE;
        SELECT * INTO _current_game FROM games WHERE id = game_id;
    END IF;

    SELECT * INTO _current_game_prompt FROM game_prompts AS gp
    WHERE gp.game_id = _current_game.id 
        AND round = _current_game.current_round
        AND round_position = _current_game.round_position;

    IF _current_game_prompt.opened_at IS NULL THEN
        -- open the round
        UPDATE game_prompts AS gp SET
            opened_at = CURRENT_TIMESTAMP
            WHERE gp.id = _current_game_prompt.id;
        RETURN;
    ELSIF _current_game_prompt.closed_at IS NULL THEN
        UPDATE game_prompts AS gp SET
            closed_at = CURRENT_TIMESTAMP
            WHERE gp.id = _current_game_prompt.id;
        RETURN;
    END IF;

    -- next round logic
    SELECT * INTO _next_game_prompt FROM game_prompts as gp
        WHERE gp.game_id = _current_game.id
        AND opened_at IS NULL
        ORDER BY round ASC, round_position ASC
        LIMIT 1;

    -- no next round, close game
    IF NOT FOUND THEN
        UPDATE games SET
            completed_at = CURRENT_TIMESTAMP
            WHERE games.id = _current_game.id;
        RETURN;
    END IF;

    UPDATE game_prompts AS gp SET
        opened_at = CURRENT_TIMESTAMP
        WHERE gp.id = _next_game_prompt.id;

    UPDATE games SET
        current_round = _next_game_prompt.round,
        round_position = _next_game_prompt.round_position
        WHERE games.id = _current_game.id;
END;
$$
