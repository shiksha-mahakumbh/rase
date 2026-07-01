-- Shiksha Mahakumbh — Supabase seed (RBAC + registration counter)
-- Run after Prisma migration: supabase db reset OR psql -f supabase/seed.sql
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING)

-- ─── Roles ───────────────────────────────────────────────────────────────────

INSERT INTO roles (id, name, slug, description, is_system, created_at, updated_at)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'Super Admin', 'super-admin', 'Full platform access', true, NOW(), NOW()),
  ('00000000-0000-4000-8000-000000000002', 'Admin', 'admin', 'Registration and content management', true, NOW(), NOW()),
  ('00000000-0000-4000-8000-000000000003', 'Data Entry', 'data-entry', 'Registration status updates only', true, NOW(), NOW()),
  ('00000000-0000-4000-8000-000000000004', 'Coordinator', 'coordinator', 'Read-only registrations and committees', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ─── Permissions ─────────────────────────────────────────────────────────────

INSERT INTO permissions (id, resource, action, slug, description, created_at, updated_at)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'registrations', 'read', 'registrations.read', 'View registrations', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000002', 'registrations', 'create', 'registrations.create', 'Create registrations', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000003', 'registrations', 'update', 'registrations.update', 'Update registrations', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000004', 'registrations', 'delete', 'registrations.delete', 'Delete registrations', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000005', 'registrations', 'export', 'registrations.export', 'Export registrations', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000006', 'committees', 'read', 'committees.read', 'View committees', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000007', 'committees', 'manage', 'committees.manage', 'Manage committees', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000008', 'media', 'read', 'media.read', 'View media', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000009', 'media', 'manage', 'media.manage', 'Manage media', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000010', 'contact', 'read', 'contact.read', 'View contact messages', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000011', 'contact', 'manage', 'contact.manage', 'Reply to contact messages', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000012', 'feedback', 'read', 'feedback.read', 'View feedback', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000013', 'feedback', 'manage', 'feedback.manage', 'Reply to feedback', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000014', 'exports', 'create', 'exports.create', 'Generate CSV/Excel exports', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000015', 'payments', 'read', 'payments.read', 'View payment records', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000016', 'audit_logs', 'read', 'audit_logs.read', 'View audit logs', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000017', 'users', 'manage', 'users.manage', 'Manage admin users and roles', NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000018', 'settings', 'manage', 'settings.manage', 'Manage system settings', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Super Admin — all permissions
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT
  gen_random_uuid(),
  '00000000-0000-4000-8000-000000000001',
  p.id
FROM permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Admin — registrations, committees, media, contact, feedback, exports, payments, audit
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), '00000000-0000-4000-8000-000000000002', p.id
FROM permissions p
WHERE p.slug IN (
  'registrations.read', 'registrations.create', 'registrations.update', 'registrations.delete', 'registrations.export',
  'committees.read', 'committees.manage',
  'media.read', 'media.manage',
  'contact.read', 'contact.manage',
  'feedback.read', 'feedback.manage',
  'exports.create',
  'payments.read',
  'audit_logs.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Data Entry — read, update, and export registrations (gate staff)
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), '00000000-0000-4000-8000-000000000003', p.id
FROM permissions p
WHERE p.slug IN ('registrations.read', 'registrations.update', 'registrations.export')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Coordinator — read registrations + committees
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT gen_random_uuid(), '00000000-0000-4000-8000-000000000004', p.id
FROM permissions p
WHERE p.slug IN ('registrations.read', 'committees.read')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ─── Registration counter ────────────────────────────────────────────────────
-- last_number=1 matches existing Firebase counter after SMK2026-000001 test record.
-- Set to 0 for a fresh environment with no migrated data.

INSERT INTO registration_counters (id, prefix, last_number, created_at, updated_at)
VALUES ('20000000-0000-4000-8000-000000000001', 'SMK2026', 1, NOW(), NOW())
ON CONFLICT (prefix) DO NOTHING;

-- ─── System settings ─────────────────────────────────────────────────────────

INSERT INTO system_settings (id, key, value, category, created_at, updated_at)
VALUES
  (
    '30000000-0000-4000-8000-000000000001',
    'registration.backend',
    '"supabase"'::jsonb,
    'registration',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'registration.id_prefix',
    '"SMK2026"'::jsonb,
    'registration',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'event.name',
    '"Shiksha Mahakumbh 6.0"'::jsonb,
    'event',
    NOW(),
    NOW()
  )
ON CONFLICT (key) DO NOTHING;
