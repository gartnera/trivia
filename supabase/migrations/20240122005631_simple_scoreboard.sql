CREATE OR REPLACE VIEW simple_scoreboard
AS
SELECT
    g.id AS game_id,
    t.name AS team_name,
    count(CASE WHEN rs.is_correct THEN 1 END) AS score,
    sum(
        extract(EPOCH FROM (r.updated_at - gp.opened_at))
    ) AS total_submission_speed,
    count(*) AS max_possible_score
FROM responses AS r
LEFT JOIN response_scores AS rs ON r.id = rs.response_id
LEFT JOIN game_prompts AS gp ON r.game_prompt_id = gp.id
LEFT JOIN games AS g ON gp.game_id = g.id
LEFT JOIN teams AS t ON r.team_id = t.id
WHERE
    g.id IN (SELECT private.get_games_for_user())
    OR g.id IN (SELECT private.get_games_for_league_owners())
GROUP BY g.id, t.id
ORDER BY score DESC, total_submission_speed ASC
