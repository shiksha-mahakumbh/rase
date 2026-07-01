-- Admin session revocation: bump session_version to invalidate signed cookies.
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
