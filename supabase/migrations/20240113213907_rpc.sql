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
$$;

CREATE OR REPLACE PROCEDURE join_game(
    team_id bigint,
    join_code text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_variable
DECLARE
    _game RECORD;
BEGIN
    SELECT * INTO _game FROM games AS g WHERE LOWER(g.join_code) = LOWER(join_code) AND g.completed_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active game found';
    END IF;

    IF _game.completed_at IS NOT NULL THEN
        RAISE EXCEPTION 'Game already completed';
    END IF;

    PERFORM NULL FROM teams AS t WHERE t.id = team_id AND t.id IN (SELECT private.get_teams_for_user());
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No team found: %', team_id;
    END IF;

    -- if team is already a member (conflict) do nothing
    INSERT INTO team_games ("game_id", "team_id") VALUES (_game.id, team_id) ON CONFLICT DO NOTHING;
END;
$$;

CREATE OR REPLACE PROCEDURE join_team(
    join_code text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_variable
DECLARE
    _team RECORD;
BEGIN
    SELECT * INTO _team FROM teams AS t WHERE LOWER(t.join_code) = LOWER(join_code);
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No team found';
    END IF;

    -- if team is already a member (conflict) do nothing
    INSERT INTO team_members ("team_id", "user_id") VALUES (_team.id, auth.uid()) ON CONFLICT DO NOTHING;
END;
$$
