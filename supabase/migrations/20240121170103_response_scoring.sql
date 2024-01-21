CREATE UNIQUE INDEX response_scores_response_id_unique_idx
ON public.response_scores (response_id);

ALTER TABLE responses
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE response_scores
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE OR REPLACE FUNCTION private.handle_responses_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;

    -- clear the score if the answer has changed
    IF LOWER(NEW.answer) != LOWER(OLD.answer) THEN
        DELETE FROM public.response_scores WHERE response_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER responses_update_trigger
BEFORE UPDATE ON responses
FOR EACH ROW
EXECUTE FUNCTION private.handle_responses_updated();

CREATE OR REPLACE FUNCTION private.handle_response_scores_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER response_scores_update_trigger
BEFORE UPDATE ON response_scores
FOR EACH ROW
EXECUTE FUNCTION private.handle_response_scores_updated();

CREATE OR REPLACE VIEW scoring_view
AS
SELECT
    r.id AS id,
    r.game_prompt_id AS game_prompt_id,
    r.user_id AS user_id,
    r.team_id AS team_id,
    t.name AS team_name,
    r.answer AS answer,
    r.created_at AS created_at,
    r.updated_at AS updated_at,
    rs.updated_at AS score_updated_at,
    rs.is_scored AS is_scored,
    rs.is_correct AS is_correct
FROM
    responses AS r
LEFT JOIN response_scores AS rs ON r.id = rs.response_id
LEFT JOIN teams AS t ON r.team_id = t.id
WHERE r.game_prompt_id IN (SELECT private.get_game_prompts_for_league_owners());

CREATE POLICY "league_owners_team_games"
ON team_games
FOR SELECT USING (
    game_id IN (
        SELECT private.get_games_for_league_owners()
    )
);
