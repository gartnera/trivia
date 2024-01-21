CREATE UNIQUE INDEX responses_team_game_unique_idx
ON public.responses (team_id, game_prompt_id);
