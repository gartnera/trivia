CREATE OR REPLACE FUNCTION advance_game(game_id bigint) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    _current_game RECORD;
    _current_round INT;
    _next_round_position INT;
BEGIN
    SELECT * INTO _current_game FROM games WHERE id = game_id AND game_id IN (SELECT private.get_games_for_league_owners());
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No game found with id %', game_id;
    END IF;

    _current_round := COALESCE(_current_game.current_round, 1);
    _next_round_position := COALESCE(_current_game.round_position + 1, 1);

    IF _current_game.started_at IS NOT NULL THEN
        -- first mark the current round as closed
        UPDATE game_prompts AS gp
            SET closed_at = CURRENT_TIMESTAMP 
            WHERE gp.game_id = _current_game.id 
            AND round = _current_game.current_round
            AND round_position = _current_game.round_position;
    ELSE
        -- this is the first call
        UPDATE games 
            SET started_at = CURRENT_TIMESTAMP,
                current_round = 1,
                round_position = 1;
    END IF;

    IF _next_round_position > _current_game.total_round_positions THEN
        _next_round_position := 0;
        _current_round := _current_round + 1;
    END IF;

    IF _current_round <= _current_game.total_rounds THEN
        UPDATE games
            SET current_round = _current_round,
                round_position = _next_round_position;
        UPDATE game_prompts AS gp
            SET opened_at = CURRENT_TIMESTAMP
            WHERE gp.game_id = _current_game.id
            AND round = _current_round 
            AND round_position = _next_round_position;
    ELSE
        UPDATE games
            SET completed_at = CURRENT_TIMESTAMP;
    END IF;
END;
$$
