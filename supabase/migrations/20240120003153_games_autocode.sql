ALTER TABLE teams
ADD CONSTRAINT teams_unique_join_code UNIQUE (join_code);

ALTER TABLE teams
ALTER COLUMN join_code SET NOT NULL;

ALTER TABLE teams
ADD CONSTRAINT teams_not_empty_join_code CHECK (join_code != '');

ALTER TABLE teams
ALTER COLUMN name SET NOT NULL;

ALTER TABLE teams
ADD CONSTRAINT teams_name_not_empty CHECK (name != '');

ALTER TABLE games
ADD CONSTRAINT games_unique_join_code UNIQUE (join_code);

ALTER TABLE games
ALTER COLUMN join_code SET NOT NULL;

ALTER TABLE games
ADD CONSTRAINT games_not_empty_join_code CHECK (join_code != '');

CREATE OR REPLACE FUNCTION private.populate_team_join_code()
RETURNS TRIGGER AS $$
#variable_conflict use_variable
DECLARE
    _join_code TEXT;
    _join_code_ok BOOLEAN DEFAULT FALSE;
BEGIN
    IF NEW.join_code IS NOT NULL THEN
        RETURN NEW;
    END IF;

    WHILE _join_code_ok != TRUE LOOP
        _join_code := CAST(CAST(floor(random() * (99999 - 10000 + 1) + 10000) AS INT) AS TEXT);
        PERFORM NULL FROM teams AS t WHERE t.join_code = _join_code;
        IF NOT FOUND THEN
            _join_code_ok := TRUE;
        END IF;
    END LOOP;

    NEW.join_code = _join_code;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER teams_populate_join_code
BEFORE INSERT ON teams
FOR EACH ROW
EXECUTE FUNCTION private.populate_team_join_code();

CREATE OR REPLACE FUNCTION private.populate_game_join_code()
RETURNS TRIGGER AS $$
#variable_conflict use_variable
DECLARE
    _join_code TEXT;
    _join_code_ok BOOLEAN DEFAULT FALSE;
BEGIN
    IF NEW.join_code IS NOT NULL THEN
        RETURN NEW;
    END IF;

    WHILE _join_code_ok != TRUE LOOP
        _join_code := CAST(CAST(floor(random() * (99999 - 10000 + 1) + 10000) AS INT) AS TEXT);
        PERFORM NULL FROM games AS g WHERE g.join_code = _join_code;
        IF NOT FOUND THEN
            _join_code_ok := TRUE;
        END IF;
    END LOOP;

    NEW.join_code = _join_code;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER teams_populate_game_code
BEFORE INSERT ON games
FOR EACH ROW
EXECUTE FUNCTION private.populate_team_join_code();
