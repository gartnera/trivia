CREATE OR REPLACE FUNCTION reset_game(
    game_id bigint
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_variable
DECLARE
    _current_game "games";
BEGIN
    SELECT * INTO _current_game FROM games AS g WHERE g.id = game_id AND game_id IN (SELECT private.get_games_for_league_owners());
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No game found with id %', game_id;
    END IF;

    -- this should cascade delete response_scores
    DELETE FROM responses WHERE game_prompt_id IN (SELECT id FROM game_prompts AS gp WHERE gp.game_id = _current_game.id;);

    UPDATE game_prompts AS gp SET opened_at = NULL, closed_at = NULL, closes_at = NULL WHERE gp.game_id = game_id;

    UPDATE games AS g SET
        current_round = NULL,
        round_position = NULL,
        started_at = NULL,
        completed_at = NULL,
        advance_ctr = NULL
    WHERE
        g.id = game_id;
END;
$$;
