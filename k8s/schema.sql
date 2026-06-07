CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    banned_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE threads (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES threads(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    content VARCHAR(5000) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE thread_tags (
    thread_id BIGINT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, tag_id)
);

CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE moderation_actions (
    id BIGSERIAL PRIMARY KEY,
    action_type VARCHAR(30) NOT NULL,
    moderator_id BIGINT NOT NULL REFERENCES users(id),
    target_user_id BIGINT REFERENCES users(id),
    target_thread_id BIGINT REFERENCES threads(id),
    target_post_id BIGINT REFERENCES posts(id),
    reason VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL
);
