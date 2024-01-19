CREATE OR REPLACE FUNCTION private.populate_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER responses_populate_user_id
BEFORE INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION private.populate_user_id();

CREATE OR REPLACE FUNCTION private.team_creator_member()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO team_members ("team_id", "user_id")
        VALUES (NEW.id, auth.uid());
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER teams_creator_member
AFTER INSERT ON teams
FOR EACH ROW
EXECUTE FUNCTION private.team_creator_member();
