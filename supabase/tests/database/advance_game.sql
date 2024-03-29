-- sqlfluff:max_line_length:0
BEGIN;

SELECT plan(8);

-- player should not be able to advance game
CALL auth.login_as_user('player1@test.invalid');
SELECT throws_ok(
    'SELECT advance_game(1)'
);
CALL auth.logout();

-- invalid game id
CALL auth.login_as_user('owner1@test.invalid');
SELECT throws_ok(
    'SELECT advance_game(-1)'
);
SELECT advance_game(1);
SELECT ok(games.current_round = 1 AND games.round_position = 1 AND games.started_at IS NOT NULL AND games.completed_at IS NULL, 'game init') FROM games WHERE games.id = 1;
SELECT advance_game(1);
SELECT ok(games.current_round = 1 AND games.round_position = 1 AND games.completed_at IS NULL, 'first round close') FROM games WHERE games.id = 1;
SELECT advance_game(1);
SELECT ok(games.current_round = 1 AND games.round_position = 2 AND games.completed_at IS NULL, 'second round open') FROM games WHERE games.id = 1;
SELECT advance_game(1);
SELECT ok(games.current_round = 1 AND games.round_position = 2 AND games.completed_at IS NULL, 'second round close') FROM games WHERE games.id = 1;
SELECT advance_game(1);
SELECT ok(games.current_round = 1 AND games.round_position = 2 AND games.completed_at IS NOT NULL, 'game completed') FROM games WHERE games.id = 1;
-- advancing an already complete game should throw an exception
SELECT throws_ok(
    'SELECT advance_game(1)'
);

SELECT finish();
ROLLBACK;
