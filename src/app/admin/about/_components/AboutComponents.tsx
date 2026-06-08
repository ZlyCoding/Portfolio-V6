"use client";

import { useState, useRef } from "react";
import {
  FiChevronDown,
  FiSave,
  FiLoader,
  FiMenu,
  FiX,
  FiPlus,
} from "react-icons/fi";
import {
  useImageUpload,
  type UploadResult,
} from "@/app/admin/_storage/useImageUpload";
import ImageUploadZone from "@/app/admin/_storage/ImageUploadZone";

// ── Collapsible Section ────────────────────────────────────────────────────────
export function CollapsibleSection({
  title,
  subtitle,
  icon: Icon,
  children,
  badge,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? "1px solid var(--border-subtle)" : "none",
          transition: "background .2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(143,92,189,.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--crimson-muted)",
            border: "1px solid var(--crimson-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} color="var(--crimson)" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "clamp(13px, 2vw, 15px)",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-.01em",
              }}
            >
              {title}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: "var(--crimson-muted)",
                  border: "1px solid var(--crimson-border)",
                  color: "var(--crimson)",
                  flexShrink: 0,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: "clamp(11px, 1.5vw, 12px)",
              color: "var(--text-muted)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: open ? "var(--crimson-muted)" : "rgba(255,255,255,.04)",
            border: `1px solid ${open ? "var(--crimson-border)" : "var(--border-subtle)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all .25s",
          }}
        >
          <FiChevronDown
            size={14}
            color={open ? "var(--crimson)" : "var(--text-muted)"}
            style={{
              transform: open ? "rotate(0deg)" : "rotate(-180deg)",
              transition: "transform .3s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows .3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "24px 20px" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── Field Label ────────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-secondary)",
        letterSpacing: ".06em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  );
}

// ── Save Button ────────────────────────────────────────────────────────────────
export function SaveButton({
  saving,
  onClick,
}: {
  saving: boolean;
  onClick: () => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        className="btn-primary"
        onClick={onClick}
        disabled={saving}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          minWidth: 110,
          justifyContent: "center",
        }}
      >
        {saving ? (
          <FiLoader
            size={14}
            style={{ animation: "spin .7s linear infinite" }}
          />
        ) : (
          <>
            <FiSave size={14} />
            Simpan
          </>
        )}
      </button>
    </div>
  );
}

// ── Draggable Row ──────────────────────────────────────────────────────────────
function DraggableRow({
  onDragStart,
  onDragEnter,
  onDragEnd,
  onRemove,
  children,
}: {
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr 28px",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          opacity: 0.45,
        }}
      >
        <FiMenu size={15} />
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
      <button
        onClick={onRemove}
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "rgba(143,92,189,.08)",
          border: "1px solid rgba(143,92,189,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background .15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(143,92,189,.2)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(143,92,189,.08)")
        }
      >
        <FiX size={12} color="var(--crimson)" />
      </button>
    </div>
  );
}

// ── Add Row Input ──────────────────────────────────────────────────────────────
function AddRowInput({
  placeholder,
  buttonLabel = "Add",
  onAdd,
}: {
  placeholder: string;
  buttonLabel?: string;
  onAdd: (value: string) => void;
}) {
  const [input, setInput] = useState("");

  function commit() {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        className="field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        placeholder={placeholder}
        style={{ flex: 1 }}
      />
      <button
        onClick={commit}
        style={{
          height: 40,
          paddingInline: 14,
          borderRadius: 9,
          background: "var(--crimson-muted)",
          border: "1px solid var(--crimson-border)",
          color: "var(--crimson)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          transition: "background .15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(143,92,189,.15)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "var(--crimson-muted)")
        }
      >
        <FiPlus size={14} />
        {buttonLabel}
      </button>
    </div>
  );
}

// ── Tag Input ──────────────────────────────────────────────────────────────────
export function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const val = raw.trim().replace(/,+$/, "").trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }

  function removeTag(idx: number) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 10,
          }}
        >
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 20,
                background: "var(--crimson-muted)",
                border: "1px solid var(--crimson-border)",
                fontSize: 12,
                color: "var(--text-primary)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              #{tag}
              <button
                onClick={() => removeTag(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--crimson)",
                  padding: 0,
                  fontSize: 15,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          }
          if (e.key === "Backspace" && !input && tags.length)
            removeTag(tags.length - 1);
        }}
        onBlur={() => input.trim() && addTag(input)}
        placeholder="Web Development, Anime, Open Source, Design"
      />
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
        Tekan{" "}
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: 4,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            fontSize: 10,
          }}
        >
          Enter
        </kbd>{" "}
        atau{" "}
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: 4,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            fontSize: 10,
          }}
        >
          ,
        </kbd>{" "}
        untuk tambah. Klik × untuk hapus.
      </p>
    </div>
  );
}

// ── Draggable List Input ───────────────────────────────────────────────────────
// Menggantikan SkillsInput, SocialsInput, dan ContactInput.
// mode "text"  → item ditampilkan sebagai label (Skills)
// mode "input" → item ditampilkan sebagai input yang bisa diedit (Socials, Contact)
export function DraggableListInput({
  items,
  onChange,
  mode = "input",
  placeholder,
  addPlaceholder,
  addButtonLabel = "Add",
  hint,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  mode?: "text" | "input";
  placeholder?: string;
  addPlaceholder: string;
  addButtonLabel?: string;
  hint: string;
}) {
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  function addItem(val: string) {
    const isDuplicate =
      mode === "text"
        ? items.map((s) => s.toLowerCase()).includes(val.toLowerCase())
        : items.includes(val);
    if (!isDuplicate) onChange([...items, val]);
  }

  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, val: string) {
    onChange(items.map((item, i) => (i === idx ? val : item)));
  }

  function handleDragEnd() {
    if (
      dragIdx.current === null ||
      dragOverIdx.current === null ||
      dragIdx.current === dragOverIdx.current
    )
      return;
    const updated = [...items];
    const [moved] = updated.splice(dragIdx.current, 1);
    updated.splice(dragOverIdx.current, 0, moved);
    onChange(updated);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <DraggableRow
          key={i}
          onDragStart={() => {
            dragIdx.current = i;
          }}
          onDragEnter={() => {
            dragOverIdx.current = i;
          }}
          onDragEnd={handleDragEnd}
          onRemove={() => removeItem(i)}
        >
          {mode === "text" ? (
            <span
              style={{
                fontSize: 13,
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ) : (
            <input
              className="field"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              style={{ fontSize: 13, padding: "5px 9px" }}
            />
          )}
        </DraggableRow>
      ))}
      <AddRowInput
        placeholder={addPlaceholder}
        buttonLabel={addButtonLabel}
        onAdd={addItem}
      />
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
        {hint}
      </p>
    </div>
  );
}

// ── Image Field ────────────────────────────────────────────────────────────────
// Menggantikan HeroImageField dan AvatarImageField.

export interface ImageFieldControls {
  uploadToStorage: (
    currentPath?: string | null,
  ) => Promise<UploadResult | null | undefined>;
  commitUpload: () => void;
  rollbackUpload: () => Promise<void>;
}

export function ImageField({
  initialPreview,
  onUpload,
  hint,
}: {
  initialPreview: string | null;
  onUpload: (controls: ImageFieldControls) => void;
  hint: string;
}) {
  const {
    preview,
    isDragging,
    fileRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    handleRemove,
    uploadToStorage,
    commitUpload,
    rollbackUpload,
  } = useImageUpload("about-images", initialPreview, "about");

  onUpload({ uploadToStorage, commitUpload, rollbackUpload });

  return (
    <>
      <ImageUploadZone
        preview={preview}
        isDragging={isDragging}
        label={undefined}
        hint={hint}
        minHeight={180}
        maxHeight={260}
        onClickUpload={() => fileRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onRemove={handleRemove}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
    </>
  );
}
