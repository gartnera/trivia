BEGIN;
SELECT plan(3);

-- user 1 should see one team alpha
CALL auth.login_as_user('player1@test.invalid');

SELECT ok(name = 'alpha', 'Expected: alpha, Actual: ' || name)
FROM (SELECT name FROM teams) AS q;

CALL auth.logout();

-- user 2 should see one team beta
CALL auth.login_as_user('player2@test.invalid');

SELECT ok(name = 'beta', 'Expected: beta, Actual: ' || name)
FROM (SELECT name FROM teams) AS q;

CALL auth.logout();

-- add user 2 to team 1 and ensure we can see multiple teams
INSERT INTO team_members ("team_id", "user_id") VALUES (
    1, '00000000-0000-0000-0000-000000000002'
);

-- user 2 should now see two teams
CALL auth.login_as_user('player2@test.invalid');

SELECT ok(t_count = 2, 'Expected: 2, Actual: ' || t_count)
FROM (SELECT count(*) AS t_count FROM teams) AS q;

CALL auth.logout();

SELECT finish();
ROLLBACK;
