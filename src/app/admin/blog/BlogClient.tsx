"use client";

import { useState, useRef } from "react";
import { Toast, useToast, TOAST_KEYFRAMES } from "@/components/Toast";
import {
  getPosts,
  savePost,
  togglePostStatus,
  deletePost,
  type BlogPost,
  type BlogDraft,
} from "./actions";
import type { UploadResult } from "@/app/admin/_storage/useImageUpload";

interface UploadControls {
  commitUpload: () => void;
  rollbackUpload: () => Promise<void>;
}
import {
  BlogSortDropdown,
  BlogRow,
  BlogEmptyState,
} from "./_components/BlogComponents";
import { BlogModal, DeleteModal } from "./_modals/BlogModals";
import { FiSearch, FiAlertCircle, FiRefreshCw, FiPlus } from "react-icons/fi";

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
  const savingRef = useRef(false); // ← pengaman double-submit
  const deletingRef = useRef(false); // ← pengaman double-click delete
  const { toast, showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ── Refresh manual ───────────────────────────────────────────────────────────
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
    controls: UploadControls,
  ) {
    if (savingRef.current) return; // ← guard: tolak jika sedang proses
    savingRef.current = true;
    setSaving(true);
    try {
      let image_url = draft.image_url;
      let image_path = draft.image_path;

      // Step 1: Upload foto (retry-safe — tidak re-upload jika sudah pernah berhasil)
      const uploadResult = await uploadFn(editingPost?.image_path);
      if (uploadResult !== undefined) {
        image_url = uploadResult?.url ?? null;
        image_path = uploadResult?.path ?? null;
      }

      // Step 2: Simpan ke DB
      const payload = { ...draft, image_url, image_path };
      const result = await savePost(editingPost?.id ?? null, payload);

      if (!result.success) {
        // DB gagal setelah upload berhasil → hapus file orphan dari storage
        await controls.rollbackUpload();
        throw new Error(result.error);
      }

      // Keduanya berhasil → commit (bersihkan state supaya retry tidak re-upload)
      controls.commitUpload();

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
      savingRef.current = false; // ← reset ref setelah selesai
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
    if (deletingRef.current) return; // ← guard: tolak jika sedang proses
    deletingRef.current = true;
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
      deletingRef.current = false; // ← reset ref setelah selesai
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
          <BlogSortDropdown value={sortBy} onChange={setSortBy} />
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
                <BlogEmptyState
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
