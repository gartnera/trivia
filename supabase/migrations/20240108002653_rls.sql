ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_team_category_bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA private;

CREATE FUNCTION private.get_teams_for_authenticated_user()
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

CREATE POLICY "teams_is_member"
ON teams
FOR ALL USING (
    id IN (
        SELECT private.get_teams_for_authenticated_user()
    )
);

CREATE POLICY "team_members"
ON team_members
FOR ALL USING (
    team_id IN (
        SELECT private.get_teams_for_authenticated_user()
    )
);
