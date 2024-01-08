INSERT INTO leagues ("name") VALUES ('alpha');

INSERT INTO tournaments ("league_id", "name") VALUES (1, 'alpha_alpha');
INSERT INTO tournaments ("league_id", "name") VALUES (1, 'alpha_beta');

-- id: 1
INSERT INTO teams ("name", "join_code") VALUES ('alpha', 'alpha');
-- id: 2
INSERT INTO teams ("name", "join_code") VALUES ('beta', 'beta');

-- id: 1
INSERT INTO games ("tournament_id") VALUES (1);

-- id: 1
INSERT INTO categories ("league_id", "name") VALUES (1, 'alpha');
-- id: 1
INSERT INTO prompts ("category_id", "question", "answer") VALUES (
    1, 'alpha', 'alpha'
);
-- id: 1
INSERT INTO game_prompts (
    "prompt_id", "game_id", "round", "round_position"
) VALUES (
    1, 1, 1, 1
);

-- simulate team alpha joining game 1
INSERT INTO team_games ("game_id", "team_id") VALUES (1, 1);

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    '1@test.invalid',
    '$2a$10$CS4fMVZTuVWCAaOkL.2xUuEaM1mSeVHmSnDS66uDjgFhDn0oey.mm',
    '2023-01-11 16:54:12.7991+00',
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    '2023-01-11 16:54:12.801124+00',
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NULL,
    '2023-01-11 16:54:12.796822+00',
    '2023-01-11 16:54:12.80197+00',
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
);
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    '2@test.invalid',
    '$2a$10$CS4fMVZTuVWCAaOkL.2xUuEaM1mSeVHmSnDS66uDjgFhDn0oey.mm',
    '2023-01-11 16:54:12.7991+00',
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    '2023-01-11 16:54:12.801124+00',
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NULL,
    '2023-01-11 16:54:12.796822+00',
    '2023-01-11 16:54:12.80197+00',
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
);

-- user 1 is on team 1 (alpha)
INSERT INTO team_members ("team_id", "user_id") VALUES (
    1, '00000000-0000-0000-0000-000000000001'
);
-- user 2 is on team 2 (beta)
INSERT INTO team_members ("team_id", "user_id") VALUES (
    2, '00000000-0000-0000-0000-000000000002'
);
