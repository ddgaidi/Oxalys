-- ─────────────────────────────────────────────────────────────────────────────
-- Oxalys – Supabase Schema
-- Run this in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  gender      TEXT CHECK (gender IN ('homme', 'femme', 'non-binaire', 'non-precise')) NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, gender, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'gender', 'non-precise'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── FabLabs ───────────────────────────────────────────────────────────────────
CREATE TABLE public.fablabs (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  zip_code    TEXT NOT NULL,
  city        TEXT NOT NULL,
  address     TEXT,
  logo_url    TEXT,
  cover_url   TEXT,
  safety      TEXT CHECK (safety IN ('safe', 'caution', 'danger')) NOT NULL DEFAULT 'safe',
  equipment   TEXT[],
  website     TEXT,
  email       TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fablabs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fablabs"
  ON public.fablabs FOR SELECT USING (true);

-- ── Favorites ─────────────────────────────────────────────────────────────────
CREATE TABLE public.favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fablab_id   INT  NOT NULL REFERENCES public.fablabs(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, fablab_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (SELECT COUNT(*) FROM public.favorites WHERE user_id = auth.uid()) < 5
  );

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);
