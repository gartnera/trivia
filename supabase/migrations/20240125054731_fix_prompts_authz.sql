CREATE OR REPLACE FUNCTION private.get_game_prompts_for_league_owners(
)
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM game_prompts
  WHERE game_id IN (SELECT private.get_games_for_league_owners())
$$;

CREATE OR REPLACE FUNCTION private.get_game_prompts_for_user(
    include_closed boolean DEFAULT FALSE
)
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM game_prompts
  WHERE game_id IN (SELECT private.get_games_for_user())
  AND (include_closed OR closed_at IS NULL OR closed_at < CURRENT_TIMESTAMP)
  AND (opened_at IS NOT NULL)
$$;
