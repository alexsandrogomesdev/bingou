-- CREATE DATABASE bingou;
\connect bingou;

GRANT ALL PRIVILEGES ON DATABASE bingou TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL ON SCHEMA public TO postgres;

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(64) DEFAULT '',
  document VARCHAR(14) UNIQUE,
  email VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  plan SMALLINT NOT NULL DEFAULT 0,
  starts_at BIGINT NOT NULL,
  due_at BIGINT NOT NULL,
  status SMALLINT DEFAULT 0,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- TABLE: packs
CREATE TABLE IF NOT EXISTS packs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(32) NOT NULL,
  modalities JSONB DEFAULT '[]'::jsonb,
  balls BYTEA DEFAULT '\x'::bytea,
  goods JSONB DEFAULT '[]'::jsonb
  winnings JSONB DEFAULT '[]'::jsonb,
  starts_at BIGINT DEFAULT 0,
  created_at BIGINT NOT NULL,
  
  -- Foreign Key
  CONSTRAINT fk_packs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_packs_user ON packs (user_id);


-- TABLE: cards
CREATE TABLE IF NOT EXISTS cards (
  id BIGSERIAL PRIMARY KEY,
  pack_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  numbers BYTEA DEFAULT '\x'::bytea,
  created_at BIGINT NOT NULL,
  
  -- Foreign Keys
  CONSTRAINT fk_cards_packs FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
  CONSTRAINT fk_cards_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cards_user ON cards (user_id);
CREATE INDEX IF NOT EXISTS idx_cards_pack ON cards (pack_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_pack ON cards (user_id, pack_id);


-- TABLE: recovery tokens
CREATE TABLE IF NOT EXISTS recovery_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(256) NOT NULL,
  created_at BIGINT NOT NULL,

  -- Foreign Keys
  CONSTRAINT fk_tokens_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
);

CREATE INDEX IF NOT EXISTS idx_tokens_user ON recovery_tokens (user_id);


GRANT ALL PRIVILEGES ON TABLE users TO postgres;
GRANT ALL PRIVILEGES ON TABLE packs TO postgres;
GRANT ALL PRIVILEGES ON TABLE cards TO postgres;
GRANT ALL PRIVILEGES ON TABLE recovery_tokens TO postgres;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO postgres;