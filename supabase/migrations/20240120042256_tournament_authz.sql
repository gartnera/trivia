CREATE POLICY "league_owners_tournaments"
ON tournaments
FOR ALL USING (
    league_id IN (
        SELECT private.get_owners_for_leagues()
    )
);

CREATE OR REPLACE FUNCTION private.get_tournaments_for_league_owners()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM tournaments
  WHERE id IN (
    SELECT private.get_owners_for_leagues()
  )
$$;

CREATE OR REPLACE FUNCTION private.get_games_for_league_owners()
RETURNS SETOF bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id
  FROM games
  WHERE tournament_id IN (
    SELECT private.get_tournaments_for_league_owners()
  )
$$;

-- these are autopopulated by the trigger now
ALTER TABLE games
ALTER COLUMN join_code DROP NOT NULL;

ALTER TABLE teams
ALTER COLUMN join_code DROP NOT NULL;
