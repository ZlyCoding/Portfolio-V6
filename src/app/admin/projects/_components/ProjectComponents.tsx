"use client";

import { useState } from "react";
import {
  FiGlobe,
  FiMonitor,
  FiLayers,
  FiTag,
  FiStar,
  FiFolderMinus,
  FiPlus,
  FiSettings,
} from "react-icons/fi";
import type { Project } from "../actions";
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

export const LIMIT_TITLE = 30;
export const LIMIT_DESC = 250;
export const LIMIT_TYPE = 20;

// ── Sort options ───────────────────────────────────────────────────────────────

export const PROJECT_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Nama A–Z" },
  { value: "featured", label: "Featured dulu" },
];

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        background: "var(--crimson-muted)",
        border: "1px solid var(--crimson-border)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--crimson)",
        letterSpacing: ".04em",
        textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <FiTag size={9} />
      {type}
    </span>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function ProjectRow({
  project,
  onEdit,
  onArchive,
  onDelete,
}: {
  project: Project;
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
              width: 48,
              height: 36,
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
            {project.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image_url}
                alt={project.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FiLayers size={14} color="var(--text-muted)" />
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
                {project.title}
              </span>
              {project.featured && (
                <FiStar
                  size={10}
                  color="var(--crimson)"
                  fill="var(--crimson)"
                />
              )}
            </div>
            {project.description && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="desc-hide"
              >
                {project.description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 12px" }}>
        <TypeBadge type={project.type} />
      </td>
      <td style={{ padding: "14px 12px" }}>
        <StatusBadge status={project.status} />
      </td>
      <td style={{ padding: "14px 12px" }} className="col-hide-sm">
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {formatDate(project.created_at)}
        </span>
      </td>
      <td style={{ padding: "14px 12px" }} className="col-hide-sm">
        <div style={{ display: "flex", gap: 6 }}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                transition: "all .2s",
              }}
            >
              <FiGlobe size={11} />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                transition: "all .2s",
              }}
            >
              <FiMonitor size={11} />
            </a>
          )}
        </div>
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
            label={project.status === "published" ? "Archive" : "Unarchive"}
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

// ── SortDropdown ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Nama A–Z" },
  { value: "featured", label: "Featured dulu" },
];

export function TableHeaderActions({
  show,
  onManageTypes,
  onAdd,
}: {
  show: boolean;
  onManageTypes: () => void;
  onAdd: () => void;
}) {
  if (!show) return null;
  return (
    <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <button
        onClick={onManageTypes}
        title="Manage Types"
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FiSettings size={13} />
      </button>
      <button
        onClick={onAdd}
        title="Tambah Project"
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
    </div>
  );
}

// ── ProjectSortDropdown ────────────────────────────────────────────────────────

export function ProjectSortDropdown({
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
      options={PROJECT_SORT_OPTIONS}
    />
  );
}

// ── ProjectEmptyState ──────────────────────────────────────────────────────────

export function ProjectEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      onAdd={onAdd}
      icon={<FiFolderMinus size={26} color="var(--crimson)" />}
      title="Belum ada project"
      description="Tambahkan project pertama ke portfolio Anda."
      addLabel="Add Project"
      colSpan={7}
    />
  );
}
