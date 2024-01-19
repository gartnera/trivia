-- sqlfluff:max_line_length:0
BEGIN;

SELECT plan(2);

CALL auth.login_as_user('player2@test.invalid');
-- incorrect code should not be able to join team
SELECT throws_ok(
    'CALL join_team(2, ''invalid'');'
);
SELECT lives_ok(
    'CALL join_team(''alpha'');'
);

SELECT finish();
ROLLBACK;
