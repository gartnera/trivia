-- sqlfluff:max_line_length:0
BEGIN;

SELECT plan(3);

CALL auth.login_as_user('player2@test.invalid');
-- incorrect code should not be able to join game
SELECT throws_ok(
    'SELECT join_game(2, ''invalid'');'
);
-- invalid team
SELECT throws_ok(
    'SELECT join_game(99, ''invalid'');'
);
SELECT lives_ok(
    'SELECT join_game(2, ''join_code'');'
);

SELECT finish();
ROLLBACK;
