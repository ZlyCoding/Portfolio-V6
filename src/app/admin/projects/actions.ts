"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import {
  ProjectDraftSchema,
  ProjectTypeSchema,
  ToggleStatusSchema,
  formatZodError,
} from "@/lib/schemas";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  live_url: string;
  github_url: string;
  image_url: string | null;
  image_path: string | null;
  featured: boolean;
  status: "published" | "archived";
  created_at: string;
}

export type ProjectDraft = import("@/lib/schemas").ProjectDraft;

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

// ── Get Projects & Types ───────────────────────────────────────────────────────

export async function getProjectsAndTypes(): Promise<{
  projects: Project[];
  projectTypes: string[];
}> {
  const { supabase } = await getAuthenticatedAdmin();

  const [{ data: proj, error: projErr }, { data: types, error: typesErr }] =
    await Promise.all([
      supabase
        .from("projects")
        .select(
          "id, title, description, type, live_url, github_url, image_url, image_path, featured, status, created_at",
        )
        .order("created_at", { ascending: false }),
      supabase.from("project_types").select("name").order("name"),
    ]);

  if (projErr) throw new Error(projErr.message);
  if (typesErr) throw new Error(typesErr.message);

  return {
    projects: proj ?? [],
    projectTypes: (types ?? []).map((t) => t.name),
  };
}

// ── Save Project (create / update) ────────────────────────────────────────────

export async function saveProject(
  editingId: string | null,
  payload: unknown,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ProjectDraftSchema.safeParse(payload);
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    const data = parsed.data;

    // Database Query
    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", editingId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("projects")
        .insert({ ...data, status: "published" });
      if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menyimpan project",
    };
  }
}

// ── Toggle Archive Status ──────────────────────────────────────────────────────

export async function toggleProjectStatus(
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
      .from("projects")
      .update({ status: newStatus })
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal ubah status project",
    };
  }
}

// ── Delete Project ─────────────────────────────────────────────────────────────

export async function deleteProject(
  id: string,
  imagePath: string | null,
): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ToggleStatusSchema.shape.id.safeParse(id);
    if (!parsed.success)
      return { success: false, error: "ID project tidak valid." };

    // Database Query
    if (imagePath) {
      await supabase.storage.from("project-images").remove([imagePath]);
    }
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", parsed.data);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menghapus project",
    };
  }
}

// ── Add Project Type ───────────────────────────────────────────────────────────

export async function addProjectType(name: string): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ProjectTypeSchema.safeParse({ name });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const { error } = await supabase
      .from("project_types")
      .insert({ name: parsed.data.name });
    if (error) throw new Error(error.message);

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menambah tipe project",
    };
  }
}

// ── Delete Project Type ────────────────────────────────────────────────────────

export async function deleteProjectType(name: string): Promise<ActionResult> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation
    const parsed = ProjectTypeSchema.safeParse({ name });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Database Query
    const { error } = await supabase
      .from("project_types")
      .delete()
      .eq("name", parsed.data.name);
    if (error) throw new Error(error.message);

    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menghapus tipe project",
    };
  }
}
