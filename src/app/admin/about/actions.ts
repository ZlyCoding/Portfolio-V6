"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import {
  NameSectionSchema,
  HeroSectionSchema,
  AboutSectionSchema,
  SkillsSchema,
  SocialsSchema,
  ContactSchema,
  formatZodError,
} from "@/lib/schemas";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProfileData {
  id: string;
  full_name: string | null;
  role: string | null;
  tags: string[] | null;
  quote: string | null;
  bio: string | null;
  hero_url: string | null;
  avatar_url: string | null;
  socials: string[] | null;
  skills: string[] | null;
  contact: string[] | null;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  profileId?: string;
}

// ── Auth Guard ─────────────────────────────────────────────────────────────────

async function getAuthenticatedAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Auth Check
  if (authError || !user) throw new Error("Unauthorized: sesi tidak valid");

  // Role Check
  if (user.app_metadata?.role !== "admin")
    throw new Error("Forbidden: bukan admin");

  return { supabase, user };
}

// ── Upsert helper ──────────────────────────────────────────────────────────────

async function upsertProfile(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  profileId: string | null,
  data: Record<string, unknown>,
): Promise<string> {
  const payload = { ...data, updated_at: new Date().toISOString() };

  if (profileId) {
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", profileId);
    if (error) throw new Error(error.message);
    return profileId;
  }

  const { data: inserted, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return inserted.id;
}

// ── Get Profile ────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<ProfileData | null> {
  const { supabase } = await getAuthenticatedAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, role, tags, quote, bio, hero_url, avatar_url, socials, skills, contact",
    )
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    ...data,
    socials: data.socials ?? [],
    skills: data.skills ?? [],
    contact: data.contact ?? [],
  };
}

// ── Save Name Section ──────────────────────────────────────────────────────────

export async function saveNameSection(
  profileId: string | null,
  payload: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = NameSectionSchema.safeParse(payload);
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, parsed.data);
    revalidatePath("/admin/about");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan nama",
    };
  }
}

// ── Save Hero Section ──────────────────────────────────────────────────────────

export async function saveHeroSection(
  profileId: string | null,
  payload: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = HeroSectionSchema.safeParse(payload);
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, parsed.data);
    revalidatePath("/admin/about");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan hero section",
    };
  }
}

// ── Save About Section ─────────────────────────────────────────────────────────

export async function saveAboutSection(
  profileId: string | null,
  payload: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = AboutSectionSchema.safeParse(payload);
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, parsed.data);
    revalidatePath("/admin/about");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan about section",
    };
  }
}

// ── Save Skills ────────────────────────────────────────────────────────────────

export async function saveSkills(
  profileId: string | null,
  skills: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = SkillsSchema.safeParse({ skills });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, {
      skills: parsed.data.skills,
    });
    revalidatePath("/admin/about");
    revalidatePath("/");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan skills",
    };
  }
}

// ── Save Socials ───────────────────────────────────────────────────────────────

export async function saveSocials(
  profileId: string | null,
  socials: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = SocialsSchema.safeParse({ socials });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, {
      socials: parsed.data.socials,
    });
    revalidatePath("/admin/about");
    revalidatePath("/");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan socials",
    };
  }
}

// ── Save Contact ───────────────────────────────────────────────────────────────

export async function saveContact(
  profileId: string | null,
  contact: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ContactSchema.safeParse({ contact });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const id = await upsertProfile(supabase, profileId, {
      contact: parsed.data.contact,
    });
    revalidatePath("/admin/about");
    revalidatePath("/");
    return { success: true, profileId: id };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan contact",
    };
  }
}
