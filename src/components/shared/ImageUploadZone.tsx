"use client";

import { FiImage, FiX } from "react-icons/fi";

interface ImageUploadZoneProps {
  preview: string | null;
  isDragging: boolean;
  label?: string;
  hint?: string;
  minHeight?: number;
  maxHeight?: number;
  onClickUpload: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: () => void;
}

/**
 * Reusable drag-and-drop image upload zone.
 * Gunakan bersama hook useImageUpload.
 */
export default function ImageUploadZone({
  preview,
  isDragging,
  label,
  hint = "JPG, PNG, WebP · Maks 3 MB",
  minHeight = 200,
  maxHeight = 280,
  onClickUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
}: ImageUploadZoneProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-secondary)",
            letterSpacing: ".07em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
      )}

      <div
        onClick={onClickUpload}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${
            isDragging
              ? "var(--crimson)"
              : preview
                ? "var(--crimson-border)"
                : "var(--border)"
          }`,
          borderRadius: 12,
          background: isDragging
            ? "var(--crimson-muted)"
            : preview
              ? "transparent"
              : "var(--bg-secondary)",
          cursor: "pointer",
          overflow: "hidden",
          transition: "all .2s",
          position: "relative",
          minHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                minHeight,
                maxHeight,
              }}
            />
            {/* Overlay on hover */}
            <div
              className="img-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.55)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                opacity: 0,
                transition: "opacity .2s",
              }}
            >
              <FiImage size={20} color="#fff" />
              <span style={{ fontSize: 12, color: "#fff" }}>Ganti gambar</span>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "rgba(0,0,0,.6)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <FiX size={13} />
            </button>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: 24,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--crimson-muted)",
                border: "1px solid var(--crimson-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiImage size={18} color="var(--crimson)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginBottom: 3,
                }}
              >
                Klik atau seret gambar ke sini
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{hint}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .img-overlay:hover { opacity: 1 !important; }
        div:hover > .img-overlay { opacity: 1; }
      `}</style>
    </div>
  );
}
