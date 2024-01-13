CREATE OR REPLACE VIEW team_game_prompts
AS
SELECT
    gp.id AS game_prompt_id,
    gp.round,
    gp.round_position,
    gp.created_at AS game_prompt_created_at,
    gp.opened_at,
    gp.closed_at,
    gp.closes_at,
    p.id AS prompt_id,
    p.category_id,
    p.question,
    c.name AS category_name,
    r.answer AS team_answer,
    rs.is_scored AS is_scored,
    rs.is_correct AS is_correct,
    CASE
        WHEN gp.closed_at IS NULL THEN NULL
        ELSE p.answer
    END AS actual_answer
FROM
    game_prompts AS gp
INNER JOIN
    prompts AS p ON gp.prompt_id = p.id
INNER JOIN
    categories AS c ON p.category_id = c.id
LEFT JOIN responses AS r ON gp.id = r.game_prompt_id
LEFT JOIN response_scores AS rs ON r.id = rs.response_id
WHERE gp.id IN (SELECT private.get_game_prompts_for_user(TRUE));
