"use client";

import { useState, useRef } from "react";
import { uploadImage, deleteImage } from "@/app/admin/_storage/uploadImage";

const MAX_SIZE_MB = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_LABEL = "JPG, PNG, atau WebP";

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Hook untuk mengelola image upload ke Supabase Storage via Server Action.
 *
 * Flow: Admin (hook) → Server Action → Validasi → Storage Upload → Save DB
 *
 * @param bucket         - Nama bucket Supabase Storage (misal: "about-images")
 * @param initialPreview - URL preview awal (dari data yang sudah ada)
 * @param folder         - Subfolder di dalam bucket, misal "about" → path: "about/{filename}" (opsional)
 */
export function useImageUpload(
  bucket: string,
  initialPreview?: string | null,
  folder?: string | null,
) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /**
   * Menyimpan hasil upload sementara agar bisa di-rollback jika saveProject/savePost gagal.
   * Reset ke null setelah save berhasil atau setelah rollback.
   */
  const pendingUploadRef = useRef<UploadResult | null>(null);

  // ── Validasi client-side (UX cepat, sebelum kirim ke server) ────────────────
  function handleFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`Format tidak didukung. Gunakan ${ALLOWED_LABEL}.`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file maks ${MAX_SIZE_MB} MB`);
      return;
    }
    // Reset pending upload lama jika user ganti file sebelum retry
    pendingUploadRef.current = null;
    setImageFile(file);
    setIsRemoved(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setImageFile(null);
    setPreview(null);
    setIsRemoved(true);
    pendingUploadRef.current = null;
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  /**
   * Upload file ke Supabase Storage melalui Server Action.
   *
   * Retry-safe: jika upload sudah berhasil sebelumnya (pendingUploadRef terisi),
   * fungsi ini mengembalikan hasil yang sama tanpa re-upload ke storage.
   *
   * Flow: FormData → Server Action (auth + validasi server) → Storage → return { url, path }
   *
   * @param currentPath - Path file lama yang akan dihapus jika ada upload baru
   * @returns UploadResult { url, path }  — ada file baru yang diupload
   *          null                        — file di-remove (isRemoved = true)
   *          undefined                   — tidak ada perubahan
   */
  async function uploadToStorage(
    currentPath?: string | null,
  ): Promise<UploadResult | null | undefined> {
    // Ada file baru dipilih → upload via Server Action
    if (imageFile) {
      // ── Retry protection: jika sudah pernah upload dan belum di-commit, pakai hasil lama ──
      if (pendingUploadRef.current) {
        return pendingUploadRef.current;
      }

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("bucket", bucket);

      const result = await uploadImage(
        formData,
        currentPath ?? undefined,
        folder ?? undefined,
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Simpan sementara — akan di-rollback jika DB save gagal, atau di-commit jika berhasil
      const uploaded: UploadResult = { url: result.url, path: result.path };
      pendingUploadRef.current = uploaded;
      return uploaded;
    }

    // User hapus gambar → hapus dari storage via Server Action
    if (isRemoved) {
      if (currentPath) {
        await deleteImage(bucket, currentPath);
        // Lanjut walau gagal hapus — tidak kritikal untuk flow save
      }
      return null;
    }

    // Tidak ada perubahan gambar
    return undefined;
  }

  /**
   * Dipanggil oleh handleSave di Client setelah DB save berhasil.
   * Membersihkan imageFile dari state agar retry berikutnya tidak menganggap
   * masih ada file baru yang perlu diupload.
   */
  function commitUpload() {
    pendingUploadRef.current = null;
    setImageFile(null);
  }

  /**
   * Dipanggil oleh handleSave di Client jika DB save gagal setelah upload berhasil.
   * Menghapus file orphan dari storage dan mereset pending state.
   */
  async function rollbackUpload() {
    const pending = pendingUploadRef.current;
    if (!pending) return;
    pendingUploadRef.current = null;
    try {
      await deleteImage(bucket, pending.path);
    } catch {
      // Rollback gagal → file jadi orphan, tapi tidak kritikal untuk UX.
      // Bisa di-cleanup manual via Supabase dashboard.
      console.error(
        "[useImageUpload] Rollback orphan file gagal:",
        pending.path,
      );
    }
  }

  return {
    imageFile,
    preview,
    isDragging,
    isRemoved,
    fileRef,
    handleFile,
    handleRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    uploadToStorage,
    commitUpload,
    rollbackUpload,
  };
}
