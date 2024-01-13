CREATE OR REPLACE VIEW game_prompts_view WITH (security_invoker = on)
AS
SELECT
    gp.id AS game_prompt_id,
    gp.round,
    gp.round_position,
    gp.created_at AS game_prompt_created_at,
    gp.opened_at,
    gp.closed_at,
    gp.is_correct,
    gp.closes_at,
    p.id AS prompt_id,
    p.category_id,
    p.question,
    p.answer,
    c.name AS category_name
FROM
    game_prompts AS gp
INNER JOIN
    prompts AS p ON gp.prompt_id = p.id
INNER JOIN
    categories AS c ON p.category_id = c.id;
