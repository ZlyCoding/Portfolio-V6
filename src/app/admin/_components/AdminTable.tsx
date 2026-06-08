"use client";

import { useState } from "react";
import { FiEdit2, FiArchive, FiTrash2, FiChevronDown } from "react-icons/fi";

// ── Date ───────────────────────────────────────────────────────────────────────

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── CharCount ──────────────────────────────────────────────────────────────────

export function CharCount({ value, max }: { value: string; max: number }) {
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

// ── FieldLabel ─────────────────────────────────────────────────────────────────

export function FieldLabel({
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
        fontSize: 12,
        fontWeight: 500,
        color: "var(--text-secondary)",
        marginBottom: 6,
        letterSpacing: "0.03em",
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

// ── Modal ──────────────────────────────────────────────────────────────────────

export function Modal({
  onClose,
  children,
  maxWidth = 860,
  maxHeight = "92vh",
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  maxHeight?: string;
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
          maxWidth,
          maxHeight,
          overflowY: "auto",
          boxShadow:
            "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(143,92,189,.08)",
          animation: "modalIn .22s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: "published" | "archived" }) {
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

// ── ActionBtn ──────────────────────────────────────────────────────────────────

export function ActionBtn({
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

// ── SortDropdown ───────────────────────────────────────────────────────────────

export type SortOption = { value: string; label: string };

export function SortDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SortOption[];
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)!;
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
          {options.map((opt) => (
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

// ── EmptyState ─────────────────────────────────────────────────────────────────

export function EmptyState({
  onAdd,
  icon,
  title,
  description,
  addLabel,
  colSpan = 6,
}: {
  onAdd: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  addLabel: string;
  colSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
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
            {icon}
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
              {title}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={onAdd}
            style={{ marginTop: 4 }}
          >
            {addLabel}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Re-export icons yang sering dipakai di Row/Modal ──────────────────────────

export { FiEdit2, FiArchive, FiTrash2 };
