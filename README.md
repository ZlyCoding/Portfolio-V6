-- ============================================================
-- PORTFOLIO + ADMIN PANEL — SCHEMA
-- Next.js + Supabase
--
-- URUTAN EKSEKUSI (jangan diubah):
-- 1. Extensions
-- 2. Helper functions (set_updated_at, is_admin)
-- 3. Tabel public (profiles, project_types, projects, posts)
-- 4. Tabel private (messages, admin_logs)
-- 5. Storage buckets & policies
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 2. HELPER FUNCTIONS
-- ============================================================

-- Otomatis update kolom updated_at saat row diubah
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;

$$
;

-- Cek apakah user yang sedang login adalah admin
-- Baca dari JWT app_metadata — tanpa query DB sama sekali
-- Cara set role admin: lihat catatan di bagian paling bawah
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS
$$

SELECT coalesce(
auth.jwt() -> 'app_metadata' ->> 'role' = 'admin',
false
);

$$
;


-- ============================================================
-- 3. TABEL PUBLIC
-- Siapa saja bisa membaca — untuk halaman portofolio publik
-- Hanya admin yang bisa insert, update, delete
-- ============================================================

-- ------------------------------------------------------------
-- PROFILES
-- Data tampilan portofolio: nama, bio, avatar, dll
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  full_name       text,
  bio             text,
  role            text,
  quote           text,
  tags            text[] DEFAULT '{}',
  skills          text[] DEFAULT '{}',
  contact         text[] DEFAULT '{}',
  socials         text[] DEFAULT '{}',
  avatar_url      text,
  hero_url        text,

  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profiles" ON profiles;
CREATE POLICY "Public read profiles"
ON profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Admin full access profiles"
ON profiles FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());


-- ------------------------------------------------------------
-- PROJECT TYPES
-- Kategori proyek: web, mobile, dll
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_types (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read project_types" ON project_types;
CREATE POLICY "Public read project_types"
ON project_types FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admin full access project_types" ON project_types;
CREATE POLICY "Admin full access project_types"
ON project_types FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());


-- ------------------------------------------------------------
-- PROJECTS
-- Hanya proyek berstatus 'published' yang tampil ke publik
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description     text,

  type            text NOT NULL
                  REFERENCES project_types(name)
                  ON UPDATE CASCADE
                  ON DELETE RESTRICT,

  live_url        text,
  github_url      text,
  image_url       text,
  image_path      text,
  featured        boolean NOT NULL DEFAULT false,

  status          text NOT NULL DEFAULT 'published'
                  CHECK (status IN ('published', 'archived')),

  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS projects_set_updated_at ON projects;
CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published projects" ON projects;
CREATE POLICY "Public read published projects"
ON projects FOR SELECT
USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access projects" ON projects;
CREATE POLICY "Admin full access projects"
ON projects FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());


-- ------------------------------------------------------------
-- POSTS
-- Hanya post berstatus 'published' yang tampil ke publik
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  excerpt         text,
  content         text,
  image_url       text,
  image_path      text,
  featured        boolean NOT NULL DEFAULT false,

  status          text NOT NULL DEFAULT 'published'
                  CHECK (status IN ('published', 'archived')),

  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;
CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published posts" ON posts;
CREATE POLICY "Public read published posts"
ON posts FOR SELECT
USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access posts" ON posts;
CREATE POLICY "Admin full access posts"
ON posts FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());


-- ============================================================
-- 4. TABEL PRIVATE
-- Tidak bisa diakses publik sama sekali
-- Hanya admin yang bisa membaca dan mengelola
-- ============================================================

-- ------------------------------------------------------------
-- MESSAGES
-- Kiriman dari form kontak di halaman publik
-- Publik hanya bisa insert (kirim pesan), tidak bisa membaca
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL,
  message         text NOT NULL,
  is_read         boolean NOT NULL DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert messages" ON messages;
CREATE POLICY "Public insert messages"
ON messages FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access messages" ON messages;
CREATE POLICY "Admin full access messages"
ON messages FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());


-- ------------------------------------------------------------
-- ADMIN LOGS
-- Riwayat aktivitas admin: siapa melakukan apa dan kapan
-- Hanya admin yang bisa membaca dan mencatat
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_logs (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  admin_id        uuid, -- UUID dari auth.users, disimpan manual saat log dibuat

  action          text NOT NULL,
  metadata        jsonb DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read logs" ON admin_logs;
CREATE POLICY "Admin read logs"
ON admin_logs FOR SELECT
TO authenticated
USING (is_admin());

DROP POLICY IF EXISTS "Admin insert logs" ON admin_logs;
CREATE POLICY "Admin insert logs"
ON admin_logs FOR INSERT
TO authenticated
WITH CHECK (is_admin());


-- ============================================================
-- 5. STORAGE
-- ============================================================

-- ------------------------------------------------------------
-- BUCKETS
-- Semua bucket public — URL gambar bisa diakses langsung
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- STORAGE POLICIES
-- Publik bisa membaca semua file
-- Hanya admin yang bisa upload dan hapus file
-- ------------------------------------------------------------

-- about-images
DROP POLICY IF EXISTS "Public read about-images" ON storage.objects;
CREATE POLICY "Public read about-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-images');

DROP POLICY IF EXISTS "Admin upload about-images" ON storage.objects;
CREATE POLICY "Admin upload about-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'about-images' AND is_admin());

DROP POLICY IF EXISTS "Admin delete about-images" ON storage.objects;
CREATE POLICY "Admin delete about-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'about-images' AND is_admin());

-- project-images
DROP POLICY IF EXISTS "Public read project-images" ON storage.objects;
CREATE POLICY "Public read project-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin upload project-images" ON storage.objects;
CREATE POLICY "Admin upload project-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images' AND is_admin());

DROP POLICY IF EXISTS "Admin delete project-images" ON storage.objects;
CREATE POLICY "Admin delete project-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND is_admin());

-- post-images
DROP POLICY IF EXISTS "Public read post-images" ON storage.objects;
CREATE POLICY "Public read post-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

DROP POLICY IF EXISTS "Admin upload post-images" ON storage.objects;
CREATE POLICY "Admin upload post-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images' AND is_admin());

DROP POLICY IF EXISTS "Admin delete post-images" ON storage.objects;
CREATE POLICY "Admin delete post-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND is_admin());


-- ============================================================
-- CARA SET ROLE ADMIN (WAJIB DILAKUKAN SEBELUM LOGIN)
--
-- Jalankan sekali via script Node.js menggunakan service role key:
--
-- import { createClient } from "@supabase/supabase-js";
--
-- async function main() {
--  const supabase = createClient(
--    "https://xxx.supabase.co",
--    "SERVICE_ROLE_KEY_KAMU"
--  );
--
--  const { data, error } = await supabase.auth.admin.updateUserById("USER_ID_KAMU", {
--     app_metadata: { role: "admin" },
--   });
--
--   if (error) console.error("Error:", error);
--   else console.log("Done:", data.user.email);
--  }

main();
--
-- Atau via Supabase Dashboard:
--   Authentication → Users → klik user → edit app_metadata:
--   { "role": "admin" }
--
-- Verifikasi: login lalu decode JWT di https://jwt.io
-- Pastikan ada "role": "admin" di field app_metadata
-- ============================================================
$$
