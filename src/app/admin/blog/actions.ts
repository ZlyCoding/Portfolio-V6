"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import {
  BlogDraftSchema,
  ToggleStatusSchema,
  formatZodError,
} from "@/lib/schemas";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  image_path: string | null;
  featured: boolean;
  status: "published" | "archived";
  created_at: string;
}

export type BlogDraft = import("@/lib/schemas").BlogDraft;

export interface ActionResult {
  success: boolean;
  error?: string;
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

// ── Get Posts ──────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<BlogPost[]> {
  const { supabase } = await getAuthenticatedAdmin();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, excerpt, content, image_url, image_path, featured, status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Save Post (create / update) ────────────────────────────────────────────────

export async function savePost(
  editingId: string | null,
  payload: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = BlogDraftSchema.safeParse(payload);
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    const data = parsed.data;

    // Database Query
    if (editingId) {
      const { error } = await supabase
        .from("posts")
        .update(data)
        .eq("id", editingId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("posts")
        .insert({ ...data, status: "published" });
      if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan artikel",
    };
  }
}

// ── Toggle Archive Status ──────────────────────────────────────────────────────

export async function togglePostStatus(
  id: string,
  currentStatus: "published" | "archived",
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ToggleStatusSchema.safeParse({ id, currentStatus });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const newStatus =
      parsed.data.currentStatus === "published" ? "archived" : "published";
    const { error } = await supabase
      .from("posts")
      .update({ status: newStatus })
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal ubah status artikel",
    };
  }
}

// ── Delete Post ────────────────────────────────────────────────────────────────

export async function deletePost(
  id: string,
  imagePath: string | null,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ToggleStatusSchema.shape.id.safeParse(id);
    if (!parsed.success)
      return { success: false, error: "ID post tidak valid." };

    // Database Query
    if (imagePath) {
      await supabase.storage.from("post-images").remove([imagePath]);
    }
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", parsed.data);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menghapus artikel",
    };
  }
}
