"use client";

import { useState } from "react";
import {
  FiX,
  FiLayers,
  FiTag,
  FiGlobe,
  FiMonitor,
  FiStar,
  FiMinusCircle,
  FiLoader,
  FiTrash2,
  FiPlus,
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
  LIMIT_DESC,
  LIMIT_TYPE,
} from "../_components/ProjectComponents";
import type { Project, ProjectDraft } from "../actions";

// ── Manage Types Modal ────────────────────────────────────────────────────────
export function ManageTypesModal({
  projectTypes,
  projects,
  onDeleteType,
  onClose,
}: {
  projectTypes: string[];
  projects: Project[];
  onDeleteType: (t: string) => Promise<void>;
  onClose: () => void;
}) {
  const [deletingType, setDeletingType] = useState<string | null>(null);

  async function handleDelete(t: string) {
    setDeletingType(t);
    await onDeleteType(t);
    setDeletingType(null);
  }

  return (
    <Modal onClose={onClose}>
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
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiTag size={15} color="var(--text-muted)" />
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
              Manage Types
            </h2>
            <p
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}
            >
              Tipe yang tersedia untuk project.
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

      <div style={{ padding: "20px 24px", minWidth: 320, maxWidth: 420 }}>
        {projectTypes.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            Belum ada tipe yang ditambahkan.
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {projectTypes.map((t) => {
              const isUsed = projects.some((p) => p.type === t);
              return (
                <div
                  key={t}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 20,
                    border: `1px solid ${isUsed ? "var(--crimson-border)" : "var(--border)"}`,
                    background: isUsed
                      ? "var(--crimson-muted)"
                      : "var(--bg-secondary)",
                    overflow: "hidden",
                    opacity: deletingType === t ? 0.5 : 1,
                    transition: "opacity .15s",
                  }}
                >
                  <span
                    style={{
                      padding: "5px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: isUsed ? "var(--crimson)" : "var(--text-muted)",
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {t}
                  </span>
                  <button
                    onClick={() => handleDelete(t)}
                    disabled={deletingType === t}
                    title={`Hapus tipe "${t}"`}
                    style={{
                      padding: "5px 7px 5px 2px",
                      background: "transparent",
                      border: "none",
                      color: isUsed ? "var(--crimson)" : "var(--text-muted)",
                      cursor: deletingType === t ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      opacity: 0.6,
                      transition: "opacity .15s",
                    }}
                    onMouseEnter={(e) => {
                      if (deletingType !== t)
                        e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.opacity = "0.6")
                    }
                  >
                    {deletingType === t ? (
                      <FiLoader
                        size={9}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : (
                      <FiX size={9} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ── Project Modal (Add / Edit) ────────────────────────────────────────────────
export function ProjectModal({
  initial,
  projectTypes,
  onSave,
  onClose,
  onAddType,
  onDeleteType,
  saving,
}: {
  initial?: Project;
  projectTypes: string[];
  onSave: (
    p: ProjectDraft,
    uploadFn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
    controls: { commitUpload: () => void; rollbackUpload: () => Promise<void> },
  ) => Promise<void>;
  onClose: () => void;
  onAddType: (t: string) => Promise<void>;
  onDeleteType: (t: string) => Promise<void>;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.github_url ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const {
    preview: imagePreview,
    isDragging,
    isRemoved: removeImage,
    fileRef,
    handleRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    uploadToStorage,
    commitUpload,
    rollbackUpload,
  } = useImageUpload("project-images", initial?.image_url, "projects");

  const [newTypeInput, setNewTypeInput] = useState("");
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function addType() {
    const val = newTypeInput.trim().slice(0, LIMIT_TYPE);
    if (!val) return;
    await onAddType(val);
    setType(val);
    setNewTypeInput("");
    setShowTypeInput(false);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePublish() {
    if (!validate()) return;
    const draft: ProjectDraft = {
      title,
      description,
      type,
      live_url: liveUrl,
      github_url: githubUrl,
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
            <FiLayers size={15} color="var(--crimson)" />
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
              {initial ? "Edit Project" : "New Project"}
            </h2>
            <p
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}
            >
              {initial
                ? "Perbarui informasi project."
                : "Tambahkan project ke portfolio."}
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
        className="modal-grid"
      >
        {/* Kiri: Image */}
        <div
          style={{
            padding: "24px",
            borderRight: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
          className="modal-left"
        >
          <ImageUploadZone
            preview={imagePreview}
            isDragging={isDragging}
            label="Gambar Project"
            minHeight={220}
            maxHeight={300}
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
          {/* Title */}
          <div>
            <FieldLabel
              required
              counter={<CharCount value={title} max={LIMIT_TITLE} />}
            >
              Project Title
            </FieldLabel>
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, LIMIT_TITLE))}
              placeholder="Nama project kamu..."
              style={errors.title ? { borderColor: "rgba(239,68,68,.6)" } : {}}
            />
            {errors.title && (
              <p style={{ fontSize: 11, color: "#ef4444", marginTop: 5 }}>
                ⚠ {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <FieldLabel
              counter={<CharCount value={description} max={LIMIT_DESC} />}
            >
              Description
            </FieldLabel>
            <textarea
              className="field"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, LIMIT_DESC))
              }
              placeholder="Deskripsi singkat tentang project ini."
              rows={4}
              style={{ resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

          {/* Project Type */}
          <div>
            <FieldLabel>Project Type</FieldLabel>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {projectTypes.map((t) => (
                <div
                  key={t}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 20,
                    border: `1px solid ${type === t ? "var(--crimson)" : "var(--border)"}`,
                    background:
                      type === t
                        ? "var(--crimson-muted)"
                        : "var(--bg-secondary)",
                    overflow: "hidden",
                    transition: "all .15s",
                  }}
                >
                  <button
                    onClick={() => setType(type === t ? "" : t)}
                    style={{
                      padding: "5px 10px",
                      background: "transparent",
                      border: "none",
                      color:
                        type === t ? "var(--crimson)" : "var(--text-muted)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: ".04em",
                      textTransform: "uppercase",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {t}
                  </button>
                </div>
              ))}
              {showTypeInput ? (
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <input
                    autoFocus
                    className="field"
                    value={newTypeInput}
                    onChange={(e) =>
                      setNewTypeInput(e.target.value.slice(0, LIMIT_TYPE))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addType();
                      if (e.key === "Escape") setShowTypeInput(false);
                    }}
                    placeholder="Nama tipe..."
                    style={{ padding: "4px 10px", fontSize: 11, width: 110 }}
                  />
                  <button
                    onClick={addType}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "var(--crimson)",
                      border: "none",
                      color: "#fff",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowTypeInput(false)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 8,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    <FiX size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTypeInput(true)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: "1px dashed var(--border)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <FiPlus size={10} /> New Type
                </button>
              )}
            </div>
            {errors.type && (
              <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                ⚠ {errors.type}
              </p>
            )}
          </div>

          {/* URLs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <FieldLabel>Live URL</FieldLabel>
              <div style={{ position: "relative" }}>
                <FiGlobe
                  size={13}
                  color="var(--text-muted)"
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="field"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://project.com"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div>
              <FieldLabel>GitHub URL</FieldLabel>
              <div style={{ position: "relative" }}>
                <FiMonitor
                  size={13}
                  color="var(--text-muted)"
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="field"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
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

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
export function DeleteModal({
  project,
  onConfirm,
  onClose,
  deleting,
}: {
  project: Project;
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
          Hapus project ini?
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
            &ldquo;{project.title}&rdquo;
          </strong>{" "}
          akan dihapus secara permanen beserta gambarnya. Tindakan ini tidak
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
