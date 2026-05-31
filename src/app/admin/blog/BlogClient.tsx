"use client";

import { useState } from "react";
import { useImageUpload, type UploadResult } from "@/hooks/useImageUpload";
import ImageUploadZone from "@/components/shared/ImageUploadZone";
import {
  FiPlus,
  FiX,
  FiEdit2,
  FiArchive,
  FiTrash2,
  FiSearch,
  FiStar,
  FiMinusCircle,
  FiBookOpen,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronDown,
  FiFileText,
} from "react-icons/fi";
import { Toast, useToast, TOAST_KEYFRAMES } from "@/components/shared/Toast";
import {
  getPosts,
  savePost,
  togglePostStatus,
  deletePost,
  type BlogPost,
  type BlogDraft,
} from "./actions";

// ── Limits ─────────────────────────────────────────────────────────────────────
const LIMIT_TITLE = 80;
const LIMIT_EXCERPT = 200;

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CharCount({ value, max }: { value: string; max: number }) {
  const left = max - value.length;
  const warn = left <= Math.floor(max * 0.15);
  return (
    <span
      style={{
        fontSize: 10,
        color: warn ? (left <= 0 ? "#ef4444" : "#f59e0b") : "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace",
        transition: "color .2s",
      }}
    >
      {left}
    </span>
  );
}

function FieldLabel({
  children,
  required,
  counter,
}: {
  children: React.ReactNode;
  required?: boolean;
  counter?: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-secondary)",
        letterSpacing: ".06em",
        textTransform: "uppercase",
        marginBottom: 7,
      }}
    >
      <span>
        {children}
        {required && (
          <span style={{ color: "var(--crimson)", marginLeft: 3 }}>*</span>
        )}
      </span>
      {counter}
    </label>
  );
}

function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn .18s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          width: "100%",
          maxWidth: 860,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(220,20,60,.08)",
          animation: "modalIn .22s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "published" | "archived" }) {
  const isPublished = status === "published";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 20,
        background: isPublished
          ? "rgba(34,197,94,.1)"
          : "rgba(100,100,120,.12)",
        border: `1px solid ${isPublished ? "rgba(34,197,94,.25)" : "rgba(100,100,120,.2)"}`,
        fontSize: 11,
        fontWeight: 600,
        color: isPublished ? "#4ade80" : "var(--text-muted)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: isPublished ? "#4ade80" : "var(--text-muted)",
        }}
      />
      {isPublished ? "Published" : "Archived"}
    </span>
  );
}

// ── Blog Modal ─────────────────────────────────────────────────────────────────
function BlogModal({
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
  } = useImageUpload("post-images", initial?.image_url);

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
    await onSave(draft, uploadToStorage);
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
function DeleteModal({
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

// ── Action Button ──────────────────────────────────────────────────────────────
function ActionBtn({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        background: danger
          ? hovered
            ? "rgba(239,68,68,.15)"
            : "transparent"
          : hovered
            ? "var(--crimson-muted)"
            : "transparent",
        border: `1px solid ${
          danger
            ? hovered
              ? "rgba(239,68,68,.3)"
              : "var(--border-subtle)"
            : hovered
              ? "var(--crimson-border)"
              : "var(--border-subtle)"
        }`,
        color: danger
          ? hovered
            ? "#ef4444"
            : "var(--text-muted)"
          : hovered
            ? "var(--crimson)"
            : "var(--text-muted)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .15s",
      }}
    >
      {icon}
    </button>
  );
}

// ── Blog Row ───────────────────────────────────────────────────────────────────
function BlogRow({
  post,
  onEdit,
  onArchive,
  onDelete,
}: {
  post: BlogPost;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <tr
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        transition: "background .15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(220,20,60,.025)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 38,
              borderRadius: 7,
              overflow: "hidden",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {post.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image_url}
                alt={post.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FiBookOpen size={14} color="var(--text-muted)" />
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {post.title}
              </span>
              {post.featured && (
                <FiStar
                  size={10}
                  color="var(--crimson)"
                  fill="var(--crimson)"
                />
              )}
            </div>
            {post.excerpt && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="desc-hide"
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 12px" }}>
        <StatusBadge status={post.status} />
      </td>
      <td style={{ padding: "14px 12px" }} className="col-hide-sm">
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {formatDate(post.created_at)}
        </span>
      </td>
      <td style={{ padding: "14px 12px" }} className="col-hide-sm">
        {post.content ? (
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {post.content.split(/\s+/).filter(Boolean).length} words
          </span>
        ) : (
          <span
            style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.4 }}
          >
            —
          </span>
        )}
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
          <ActionBtn
            icon={<FiEdit2 size={12} />}
            label="Edit"
            onClick={onEdit}
          />
          <ActionBtn
            icon={<FiArchive size={12} />}
            label={post.status === "published" ? "Archive" : "Unarchive"}
            onClick={onArchive}
          />
          <ActionBtn
            icon={<FiTrash2 size={12} />}
            label="Hapus"
            onClick={onDelete}
            danger
          />
        </div>
      </td>
    </tr>
  );
}

// ── Sort Dropdown ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Title A–Z" },
  { value: "featured", label: "Featured first" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value)!;
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 8,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          cursor: "pointer",
          fontSize: 12,
          color: "var(--text-secondary)",
          whiteSpace: "nowrap",
        }}
      >
        {current.label}
        <FiChevronDown
          size={12}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
            zIndex: 50,
            minWidth: 140,
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            animation: "fadeIn .15s ease",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "9px 14px",
                background:
                  value === opt.value ? "var(--crimson-muted)" : "transparent",
                border: "none",
                color:
                  value === opt.value
                    ? "var(--crimson)"
                    : "var(--text-secondary)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <tr>
      <td colSpan={6}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "72px 24px",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--crimson-muted)",
              border: "1px solid var(--crimson-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiBookOpen size={26} color="var(--crimson)" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h3
              className="font-display"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Belum ada artikel
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              Tambahkan artikel pertama ke blog Anda.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={onAdd}
            style={{ marginTop: 4 }}
          >
            <FiPlus size={14} /> New Post
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Client Component ──────────────────────────────────────────────────────
export default function BlogClient({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ── Refresh manual (tombol "Coba lagi") ─────────────────────────────────────
  async function refetch() {
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  // ── Save via Server Action ───────────────────────────────────────────────────
  async function handleSave(
    draft: BlogDraft,
    uploadFn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
  ) {
    setSaving(true);
    try {
      let image_url = draft.image_url;
      let image_path = draft.image_path;

      const uploadResult = await uploadFn(editingPost?.image_path);
      if (uploadResult !== undefined) {
        image_url = uploadResult?.url ?? null;
        image_path = uploadResult?.path ?? null;
      }

      const payload = { ...draft, image_url, image_path };
      const result = await savePost(editingPost?.id ?? null, payload);

      if (!result.success) throw new Error(result.error);

      showToast(
        editingPost
          ? "Artikel berhasil diperbarui."
          : "Artikel berhasil dipublish.",
        "success",
      );
      await refetch();
      setShowModal(false);
      setEditingPost(null);
    } catch (err: unknown) {
      showToast(
        "Error: " + (err instanceof Error ? err.message : String(err)),
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  // ── Archive toggle ────────────────────────────────────────────────────────────
  async function handleArchive(post: BlogPost) {
    const result = await togglePostStatus(post.id, post.status);
    if (!result.success) {
      showToast("Gagal ubah status: " + result.error, "error");
      return;
    }
    const newStatus = post.status === "published" ? "archived" : "published";
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p)),
    );
    showToast(
      newStatus === "archived" ? "Artikel diarsipkan." : "Artikel dipublish.",
      "success",
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deletingPost) return;
    setDeleting(true);
    try {
      const result = await deletePost(deletingPost.id, deletingPost.image_path);
      if (!result.success) throw new Error(result.error);

      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      setDeletingPost(null);
      showToast("Artikel berhasil dihapus.", "success");
    } catch (err: unknown) {
      showToast(
        "Gagal hapus: " + (err instanceof Error ? err.message : String(err)),
        "error",
      );
    } finally {
      setDeleting(false);
    }
  }

  // ── Filter & sort ─────────────────────────────────────────────────────────────
  const filtered = posts
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "featured")
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* Page Header */}
      <div
        style={{
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 6,
          }}
        >
          Blog
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Daftar artikel yang ditampilkan pada halaman blog.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 10,
            background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.2)",
            marginBottom: 20,
          }}
        >
          <FiAlertCircle size={16} color="#f87171" />
          <span style={{ fontSize: 13, color: "#f87171", flex: 1 }}>
            {error}
          </span>
          <button
            onClick={refetch}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 7,
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.25)",
              color: "#f87171",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <FiRefreshCw size={12} /> Coba lagi
          </button>
        </div>
      )}

      {/* Filters */}
      {posts.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ position: "relative" }}>
            <FiSearch
              size={13}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              className="field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel"
              style={{ paddingLeft: 32, width: 200, fontSize: 13 }}
            />
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Post", "Status", "Date", "Length"].map((h, i) => (
                  <th
                    key={i}
                    className={i >= 2 ? "col-hide-sm" : ""}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th style={{ padding: "8px 12px", textAlign: "right" }}>
                  {posts.length > 0 && (
                    <button
                      onClick={() => {
                        setEditingPost(null);
                        setShowModal(true);
                      }}
                      title="Tulis Artikel"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: "var(--crimson-muted)",
                        border: "1px solid var(--crimson-border)",
                        color: "var(--crimson)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiPlus size={14} />
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && posts.length === 0 ? (
                <EmptyState
                  onAdd={() => {
                    setEditingPost(null);
                    setShowModal(true);
                  }}
                />
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      color: "var(--text-muted)",
                      fontSize: 13,
                    }}
                  >
                    Tidak ada artikel yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <BlogRow
                    key={p.id}
                    post={p}
                    onEdit={() => {
                      setEditingPost(p);
                      setShowModal(true);
                    }}
                    onArchive={() => handleArchive(p)}
                    onDelete={() => setDeletingPost(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <BlogModal
          initial={editingPost ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingPost(null);
          }}
          saving={saving}
        />
      )}
      {deletingPost && (
        <DeleteModal
          post={deletingPost}
          onConfirm={handleDelete}
          onClose={() => setDeletingPost(null)}
          deleting={deleting}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { opacity: 0; transform: scale(.95) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        ${TOAST_KEYFRAMES}
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr !important }
          .modal-left { border-right: none !important; border-bottom: 1px solid var(--border-subtle) }
          .col-hide-sm { display: none !important }
          .desc-hide { display: none !important }
        }
      `}</style>
    </div>
  );
}
