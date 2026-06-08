"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import {
  UploadImageSchema,
  DeleteImageSchema,
  formatZodError,
} from "@/lib/validation/schemas";

// ── Constants ──────────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// ── FormData Schema ────────────────────────────────────────────────────────────

const UploadFormSchema = UploadImageSchema.extend({
  file: z.custom<File>((v) => v instanceof File, "File tidak ditemukan."),
});

// ── Result Types ───────────────────────────────────────────────────────────────

export interface UploadImageResult {
  success: true;
  url: string;
  path: string;
}

export interface UploadImageError {
  success: false;
  error: string;
}

export type UploadImageResponse = UploadImageResult | UploadImageError;

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

// ── Upload Image ───────────────────────────────────────────────────────────────

/**
 * Server Action: upload gambar ke Supabase Storage.
 *
 * Flow: Admin → Server Action → Auth Check → Role Check → Zod Validation → Storage Upload → return { url, path }
 *
 * @param formData  - FormData berisi `file` (File) dan `bucket` (string)
 * @param oldPath   - Path file lama yang akan dihapus (opsional)
 * @param folder    - Subfolder di dalam bucket, misal "about" → path: "about/{filename}" (opsional)
 */
export async function uploadImage(
  formData: FormData,
  oldPath?: string | null,
  folder?: string | null,
): Promise<UploadImageResponse> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation — struktur & bucket name
    const parsed = UploadFormSchema.safeParse({
      file: formData.get("file"),
      bucket: formData.get("bucket"),
    });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    const { file, bucket } = parsed.data;

    // Zod Validation — tipe & ukuran file
    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return {
        success: false,
        error: "Format tidak didukung. Gunakan JPG, PNG, atau WebP.",
      };
    }
    if (file.size > MAX_SIZE_BYTES) {
      return { success: false, error: "Ukuran file maksimal 5 MB." };
    }
    if (file.size === 0) {
      return { success: false, error: "File kosong / tidak valid." };
    }

    // Storage Upload — dilakukan SEBELUM hapus file lama
    const ext = EXT_MAP[file.type];
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = folder ? `${folder}/${filename}` : filename;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, { upsert: false, contentType: file.type });

    if (uploadError) return { success: false, error: uploadError.message };

    // Hapus file lama HANYA jika upload baru berhasil — file lama aman jika upload gagal
    if (oldPath) {
      await supabase.storage.from(bucket).remove([oldPath]);
    }

    // Return Result
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { success: true, url: data.publicUrl, path };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal upload gambar.",
    };
  }
}

// ── Delete Image ───────────────────────────────────────────────────────────────

/**
 * Server Action: hapus gambar dari Supabase Storage.
 */
export async function deleteImage(
  bucket: string,
  path: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Auth Check + Role Check
    const { supabase } = await getAuthenticatedAdmin();

    // Zod Validation — bucket & path
    const parsed = DeleteImageSchema.safeParse({ bucket, path });
    if (!parsed.success)
      return { success: false, error: formatZodError(parsed.error) };

    // Storage Delete
    const { error } = await supabase.storage
      .from(parsed.data.bucket)
      .remove([parsed.data.path]);
    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Gagal menghapus gambar.",
    };
  }
}
