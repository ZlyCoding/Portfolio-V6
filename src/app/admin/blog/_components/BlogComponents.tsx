"use client";

import { FiBookOpen, FiStar, FiPlus } from "react-icons/fi";
import type { BlogPost } from "../actions";
import {
  formatDate,
  CharCount,
  FieldLabel,
  Modal,
  StatusBadge,
  ActionBtn,
  SortDropdown,
  EmptyState,
  FiEdit2,
  FiArchive,
  FiTrash2,
} from "@/app/admin/_components/AdminTable";

export {
  formatDate,
  CharCount,
  FieldLabel,
  Modal,
  StatusBadge,
  ActionBtn,
  SortDropdown,
  EmptyState,
};

// ── Limits ─────────────────────────────────────────────────────────────────────

export const LIMIT_TITLE = 80;
export const LIMIT_EXCERPT = 200;

// ── Sort options ───────────────────────────────────────────────────────────────

export const BLOG_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Title A–Z" },
  { value: "featured", label: "Featured first" },
];

export function BlogRow({
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
        (e.currentTarget.style.background = "rgba(143,92,189,.025)")
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

// ── SortDropdown ───────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Title A–Z" },
  { value: "featured", label: "Featured first" },
];

// ── BlogSortDropdown ───────────────────────────────────────────────────────────

export function BlogSortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <SortDropdown
      value={value}
      onChange={onChange}
      options={BLOG_SORT_OPTIONS}
    />
  );
}

// ── BlogEmptyState ─────────────────────────────────────────────────────────────

export function BlogEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      onAdd={onAdd}
      icon={<FiBookOpen size={26} color="var(--crimson)" />}
      title="Belum ada artikel"
      description="Tulis artikel pertama untuk ditampilkan di blog."
      addLabel="Tulis Artikel"
      colSpan={6}
    />
  );
}
