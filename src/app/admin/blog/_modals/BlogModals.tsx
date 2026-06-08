"use client";

import { useState } from "react";
import {
  FiX,
  FiFileText,
  FiStar,
  FiMinusCircle,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import {
  useImageUpload,
  type UploadResult,
} from "@/app/admin/_storage/useImageUpload";
import ImageUploadZone from "@/app/admin/_storage/ImageUploadZone";
import {
  Modal,
  FieldLabel,
  CharCount,
  LIMIT_TITLE,
  LIMIT_EXCERPT,
} from "../_components/BlogComponents";
import type { BlogPost, BlogDraft } from "../actions";

// ── Blog Modal ─────────────────────────────────────────────────────────────────
export function BlogModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial?: BlogPost;
  onSave: (
    draft: BlogDraft,
    uploadFn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
    controls: { commitUpload: () => void; rollbackUpload: () => Promise<void> },
  ) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    preview,
    isDragging,
    isRemoved: removeImage,
    fileRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    handleRemove,
    uploadToStorage,
    commitUpload,
    rollbackUpload,
  } = useImageUpload("post-images", initial?.image_url, "posts");

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePublish() {
    if (!validate()) return;
    const draft: BlogDraft = {
      title,
      excerpt,
      content,
      featured,
      image_url: removeImage ? null : (initial?.image_url ?? null),
      image_path: removeImage ? null : (initial?.image_path ?? null),
    };
    await onSave(draft, uploadToStorage, { commitUpload, rollbackUpload });
  }

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--crimson-muted)",
              border: "1px solid var(--crimson-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiFileText size={15} color="var(--crimson)" />
          </div>
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-.01em",
              }}
            >
              {initial ? "Edit Post" : "New Post"}
            </h2>
            <p
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}
            >
              {initial
                ? "Perbarui isi artikel."
                : "Tambahkan artikel baru ke blog."}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
        >
          <FiX size={14} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 0 }}
        className="modal-grid"
      >
        {/* Kiri: Cover */}
        <div
          style={{
            padding: "24px",
            borderRight: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
          className="modal-left"
        >
          <ImageUploadZone
            preview={preview}
            isDragging={isDragging}
            label="Cover Image"
            minHeight={200}
            maxHeight={280}
            onClickUpload={() => fileRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />

          <button
            onClick={() => setFeatured((f) => !f)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 9,
              background: featured
                ? "var(--crimson-muted)"
                : "var(--bg-secondary)",
              border: `1px solid ${featured ? "var(--crimson-border)" : "var(--border-subtle)"}`,
              cursor: "pointer",
              color: featured ? "var(--crimson)" : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              transition: "all .2s",
              marginTop: "auto",
            }}
          >
            {featured ? (
              <FiStar size={13} fill="currentColor" />
            ) : (
              <FiMinusCircle size={13} />
            )}
            {featured ? "Featured" : "Mark as Featured"}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </div>

        {/* Kanan: Form */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Judul */}
          <div>
            <FieldLabel
              required
              counter={<CharCount value={title} max={LIMIT_TITLE} />}
            >
              Post Title
            </FieldLabel>
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, LIMIT_TITLE))}
              placeholder="Judul artikel"
              style={errors.title ? { borderColor: "rgba(239,68,68,.6)" } : {}}
            />
            {errors.title && (
              <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5 }}>
                ⚠ {errors.title}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <FieldLabel
              counter={<CharCount value={excerpt} max={LIMIT_EXCERPT} />}
            >
              Excerpt
            </FieldLabel>
            <textarea
              className="field"
              value={excerpt}
              onChange={(e) =>
                setExcerpt(e.target.value.slice(0, LIMIT_EXCERPT))
              }
              placeholder="Ringkasan singkat yang ditampilkan di halaman daftar blog."
              rows={3}
              style={{ resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

          {/* Konten */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FieldLabel>
              Content
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  letterSpacing: ".04em",
                  textTransform: "none",
                  marginLeft: 6,
                }}
              >
                Markdown supported
              </span>
            </FieldLabel>
            <textarea
              className="field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# Title\n\nTulis konten di sini...\n\n## Sub-heading\n\nParagraf, **bold**, *italic*, dan [link](https://url.com) didukung.`}
              rows={10}
              style={{
                resize: "vertical",
                lineHeight: 1.7,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                flex: 1,
              }}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 8,
            }}
          >
            <button
              className="btn-ghost"
              onClick={onClose}
              style={{ padding: "10px 18px", fontSize: 13 }}
              disabled={saving}
            >
              Batal
            </button>
            <button
              className="btn-primary"
              onClick={handlePublish}
              style={{
                padding: "10px 22px",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
              disabled={saving}
            >
              {saving && (
                <FiLoader
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              {initial ? "Simpan Perubahan" : "Publish →"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
export function DeleteModal({
  post,
  onConfirm,
  onClose,
  deleting,
}: {
  post: BlogPost;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "28px 28px 24px" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            background: "rgba(239,68,68,.1)",
            border: "1px solid rgba(239,68,68,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <FiTrash2 size={18} color="#ef4444" />
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Hapus artikel ini?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          <strong style={{ color: "var(--text-secondary)" }}>
            &ldquo;{post.title}&rdquo;
          </strong>{" "}
          akan dihapus secara permanen beserta cover-nya. Tindakan ini tidak
          dapat dibatalkan.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: "9px 16px", fontSize: 13 }}
            disabled={deleting}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.3)",
              color: "#ef4444",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {deleting && (
              <FiLoader
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            )}
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
