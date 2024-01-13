CREATE OR REPLACE FUNCTION populate_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER responses_populate_user_id
BEFORE INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION populate_user_id();
