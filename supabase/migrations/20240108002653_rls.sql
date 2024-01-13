CREATE SCHEMA private;

CREATE FUNCTION private.get_teams_for_user()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  select team_id
  from team_members
  where user_id = auth.uid()
$$;

CREATE FUNCTION private.get_games_for_user()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT games.id
  FROM games
  LEFT JOIN team_games AS tg
    ON games.id = tg.game_id
  WHERE tg.team_id IN (SELECT private.get_teams_for_user())
$$;

CREATE FUNCTION private.get_game_prompts_for_user(
    include_closed boolean DEFAULT FALSE
)
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT prompt_id
  FROM game_prompts
  WHERE game_id IN (SELECT private.get_games_for_user())
  AND (include_closed OR closed_at IS NULL OR closed_at < CURRENT_TIMESTAMP)
  AND (opened_at IS NOT NULL)
$$;

CREATE POLICY "teams_is_member"
ON teams
FOR ALL USING (
    id IN (
        SELECT private.get_teams_for_user()
    )
);

CREATE POLICY "team_members"
ON team_members
FOR ALL USING (
    team_id IN (
        SELECT private.get_teams_for_user()
    )
);

CREATE POLICY "team_games"
ON games
FOR SELECT USING (
    id IN (
        SELECT private.get_games_for_user()
    )
);

CREATE POLICY "team_game_prompts"
ON game_prompts
FOR SELECT USING (
    id IN (
        SELECT private.get_game_prompts_for_user()
    )
);

CREATE POLICY "team_game_prompts_prompts"
ON prompts
FOR SELECT USING (
    id IN (
        SELECT prompt_id
        FROM game_prompts
        WHERE id IN (SELECT private.get_game_prompts_for_user())
    )
);

CREATE POLICY "team_game_prompts_prompts_categories"
ON categories
FOR SELECT USING (
    id IN (
        SELECT p.category_id
        FROM game_prompts AS gp
        INNER JOIN prompts AS p ON gp.prompt_id = p.id
        WHERE gp.id IN (SELECT private.get_game_prompts_for_user())
    )
);

CREATE POLICY "team_responses"
ON responses
FOR ALL USING (
    game_prompt_id IN (
        SELECT private.get_game_prompts_for_user(TRUE)
    ) AND team_id IN (
        SELECT private.get_teams_for_user()
    )
)
WITH CHECK (
    game_prompt_id IN (
        SELECT private.get_game_prompts_for_user()
    ) AND team_id IN (
        SELECT private.get_teams_for_user()
    )
);

CREATE POLICY "team_response_scores"
ON response_scores
FOR SELECT USING (
    response_id IN (
        SELECT id FROM responses
        WHERE
            game_prompt_id IN (
                SELECT private.get_game_prompts_for_user()
            )
    )
);


CREATE FUNCTION private.get_owners_for_leagues()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  select league_id
  from league_owners
  where user_id = auth.uid()
$$;

CREATE FUNCTION private.get_games_for_league_owners()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM games
  WHERE tournament_id IN (
    SELECT private.get_owners_for_leagues()
  )
$$;

CREATE FUNCTION private.get_game_prompts_for_league_owners(
)
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT prompt_id
  FROM game_prompts
  WHERE game_id IN (SELECT private.get_games_for_league_owners())
$$;

CREATE POLICY "league_owners_games"
ON games
FOR ALL USING (
    id IN (
        SELECT private.get_games_for_league_owners()
    )
);

CREATE POLICY "league_owners_game_prompts"
ON game_prompts
FOR ALL USING (
    game_id IN (
        SELECT private.get_games_for_league_owners()
    )
);

CREATE POLICY "league_owners_game_prompts_prompts"
ON prompts
FOR SELECT USING (
    id IN (
        SELECT prompt_id
        FROM game_prompts
        WHERE game_id IN (SELECT private.get_games_for_league_owners())
    )
);

CREATE POLICY "league_owners_game_prompts_prompts_categories"
ON categories
FOR SELECT USING (
    id IN (
        SELECT p.category_id
        FROM game_prompts AS gp
        INNER JOIN prompts AS p ON gp.prompt_id = p.id
        WHERE gp.game_id IN (SELECT private.get_games_for_league_owners())
    )
);

CREATE POLICY "league_owners_responses"
ON responses
FOR ALL USING (
    game_prompt_id IN (
        SELECT private.get_game_prompts_for_league_owners()
    )
);

CREATE POLICY "league_owners_response_scores"
ON response_scores
FOR ALL USING (
    response_id IN (
        SELECT id FROM responses
        WHERE
            game_prompt_id IN (
                SELECT private.get_game_prompts_for_league_owners()
            )
    )
);
