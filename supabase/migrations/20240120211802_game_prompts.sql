ALTER TABLE game_prompts
ALTER COLUMN game_id SET NOT NULL;

ALTER TABLE game_prompts
ALTER COLUMN round SET NOT NULL;

ALTER TABLE game_prompts
ALTER COLUMN round_position SET NOT NULL;

CREATE OR REPLACE FUNCTION generate_promptless_game(
    tournament_id bigint,
    rounds int,
    prompts_per_round int
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_variable
DECLARE
    _game "games";
BEGIN
    INSERT INTO games 
        ("tournament_id", "total_rounds", "total_round_positions")
    VALUES 
        (tournament_id, rounds, prompts_per_round)
    RETURNING * INTO _game;

    FOR round_number IN 1..rounds LOOP
        FOR round_position IN 1..prompts_per_round LOOP
            INSERT INTO game_prompts ("game_id", "round", "round_position") VALUES (_game.id, round_number, round_position);
        END LOOP;
    END LOOP;
END;
$$;
