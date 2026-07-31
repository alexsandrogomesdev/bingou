-- TABLE: users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(64) DEFAULT '',
  document VARCHAR(14) UNIQUE,
  email VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  starts_at BIGINT NOT NULL,
  due_at BIGINT NOT NULL,
  status SMALLINT DEFAULT 0,
  created_at BIGINT NOT NULL
);

CREATE INDEX idx_users_status ON users (status);


-- TABLE: packs
CREATE TABLE packs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(32) NOT NULL,
  modalities JSONB NOT NULL,
  numbers BYTEA DEFAULT '',
  victories JSONB DEFAULT '[]'::jsonb,
  starts_at BIGINT DEFAULT 0,
  created_at BIGINT NOT NULL,
  
  -- Foreign Key
  CONSTRAINT fk_packs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_packs_user ON packs (user_id);


-- TABLE: cards
CREATE TABLE cards (
  id BIGSERIAL PRIMARY KEY,
  pack_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  numbers BYTEA DEFAULT '',
  created_at BIGINT NOT NULL,
  
  -- Foreign Keys
  CONSTRAINT fk_cards_packs FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
  CONSTRAINT fk_cards_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_cards_user ON cards (user_id);
CREATE INDEX idx_cards_pack ON cards (pack_id);
CREATE INDEX idx_cards_user_pack ON cards (user_id, pack_id);