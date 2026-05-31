"use client";

import { useState, useRef } from "react";
import { useImageUpload, type UploadResult } from "@/hooks/useImageUpload";
import ImageUploadZone from "@/components/shared/ImageUploadZone";
import {
  FiChevronDown,
  FiSave,
  FiLoader,
  FiActivity,
  FiBookOpen,
  FiShare2,
  FiUser,
  FiCpu,
  FiMenu,
  FiPlus,
  FiX,
  FiPhone,
} from "react-icons/fi";
import { Toast, useToast, TOAST_KEYFRAMES } from "@/components/shared/Toast";
import {
  saveNameSection,
  saveHeroSection,
  saveAboutSection,
  saveSocials,
  saveSkills,
  saveContact,
} from "./actions";
import type { ProfileData } from "./actions";

// ── Collapsible Section ────────────────────────────────────────────────────────
function CollapsibleSection({
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
            "rgba(220,20,60,.04)";
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

// ── Tag Input ──────────────────────────────────────────────────────────────────
function TagInput({
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

// ── Field Label ────────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
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
function SaveButton({
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
          background: "rgba(220,20,60,.08)",
          border: "1px solid rgba(220,20,60,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background .15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(220,20,60,.2)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(220,20,60,.08)")
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
            "rgba(220,20,60,.15)")
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

// ── Skills Input ───────────────────────────────────────────────────────────────
function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (v: string[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  function addSkill(val: string) {
    if (!skills.map((s) => s.toLowerCase()).includes(val.toLowerCase())) {
      onChange([...skills, val]);
    }
  }

  function removeSkill(idx: number) {
    onChange(skills.filter((_, i) => i !== idx));
  }

  function handleDragEnd() {
    if (
      dragIdx.current === null ||
      dragOverIdx.current === null ||
      dragIdx.current === dragOverIdx.current
    )
      return;
    const updated = [...skills];
    const [moved] = updated.splice(dragIdx.current, 1);
    updated.splice(dragOverIdx.current, 0, moved);
    onChange(updated);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {skills.map((skill, i) => (
        <DraggableRow
          key={i}
          onDragStart={() => {
            dragIdx.current = i;
          }}
          onDragEnter={() => {
            dragOverIdx.current = i;
          }}
          onDragEnd={handleDragEnd}
          onRemove={() => removeSkill(i)}
        >
          <span
            style={{
              fontSize: 13,
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            {skill}
          </span>
        </DraggableRow>
      ))}
      <AddRowInput
        placeholder="React, Next.js, Flutter, Figma"
        onAdd={addSkill}
      />
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
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
        untuk tambah. Drag untuk mengubah urutan.
      </p>
    </div>
  );
}

// ── Socials Input ──────────────────────────────────────────────────────────────
function SocialsInput({
  links,
  onChange,
}: {
  links: string[];
  onChange: (links: string[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  function addLink(val: string) {
    if (!links.includes(val)) onChange([...links, val]);
  }

  function removeLink(idx: number) {
    onChange(links.filter((_, i) => i !== idx));
  }

  function updateLink(idx: number, val: string) {
    onChange(links.map((l, i) => (i === idx ? val : l)));
  }

  function handleDragEnd() {
    if (
      dragIdx.current === null ||
      dragOverIdx.current === null ||
      dragIdx.current === dragOverIdx.current
    )
      return;
    const updated = [...links];
    const [moved] = updated.splice(dragIdx.current, 1);
    updated.splice(dragOverIdx.current, 0, moved);
    onChange(updated);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {links.map((link, i) => (
        <DraggableRow
          key={i}
          onDragStart={() => {
            dragIdx.current = i;
          }}
          onDragEnter={() => {
            dragOverIdx.current = i;
          }}
          onDragEnd={handleDragEnd}
          onRemove={() => removeLink(i)}
        >
          <input
            className="field"
            value={link}
            onChange={(e) => updateLink(i, e.target.value)}
            placeholder="https://github.com/username"
            style={{ fontSize: 13, padding: "5px 9px" }}
          />
        </DraggableRow>
      ))}
      <AddRowInput
        placeholder="https://linkedin.com/in/username"
        buttonLabel="Add"
        onAdd={addLink}
      />
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
        Link akan ditampilkan sebagai tombol sosial pada halaman portfolio.
      </p>
    </div>
  );
}

// ── Image Fields ───────────────────────────────────────────────────────────────
function HeroImageField({
  initialPreview,
  onUpload,
}: {
  initialPreview: string | null;
  onUpload: (
    fn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
  ) => void;
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
  } = useImageUpload("about-images", initialPreview);
  onUpload(uploadToStorage);
  return (
    <>
      <ImageUploadZone
        preview={preview}
        isDragging={isDragging}
        label={undefined}
        hint="Gambar utama yang akan tampil pada bagian atas halaman."
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

function AvatarImageField({
  initialPreview,
  onUpload,
}: {
  initialPreview: string | null;
  onUpload: (
    fn: (
      currentPath?: string | null,
    ) => Promise<UploadResult | null | undefined>,
  ) => void;
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
  } = useImageUpload("about-images", initialPreview);
  onUpload(uploadToStorage);
  return (
    <>
      <ImageUploadZone
        preview={preview}
        isDragging={isDragging}
        label={undefined}
        hint="Gunakan foto yang jelas dan representatif sebagai identitas utama Anda."
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

// ── Contact Input ──────────────────────────────────────────────────────────────
function ContactInput({
  entries,
  onChange,
}: {
  entries: string[];
  onChange: (entries: string[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  function addEntry(val: string) {
    if (!entries.includes(val)) onChange([...entries, val]);
  }

  function removeEntry(idx: number) {
    onChange(entries.filter((_, i) => i !== idx));
  }

  function updateEntry(idx: number, val: string) {
    onChange(entries.map((e, i) => (i === idx ? val : e)));
  }

  function handleDragEnd() {
    if (
      dragIdx.current === null ||
      dragOverIdx.current === null ||
      dragIdx.current === dragOverIdx.current
    )
      return;
    const updated = [...entries];
    const [moved] = updated.splice(dragIdx.current, 1);
    updated.splice(dragOverIdx.current, 0, moved);
    onChange(updated);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {entries.map((entry, i) => (
        <DraggableRow
          key={i}
          onDragStart={() => {
            dragIdx.current = i;
          }}
          onDragEnter={() => {
            dragOverIdx.current = i;
          }}
          onDragEnd={handleDragEnd}
          onRemove={() => removeEntry(i)}
        >
          <input
            className="field"
            value={entry}
            onChange={(e) => updateEntry(i, e.target.value)}
            placeholder="email@example.com atau wa.me/+62 812 xxxx xxxx"
            style={{ fontSize: 13, padding: "5px 9px" }}
          />
        </DraggableRow>
      ))}
      <AddRowInput
        placeholder="email@example.com atau wa.me/+62 812 xxxx xxxx"
        buttonLabel="Add"
        onAdd={addEntry}
      />
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
        Pilih kontak yang aktif agar pengunjung dapat menghubungi Anda dengan
        mudah.
      </p>
    </div>
  );
}

// ── Main Client Component ──────────────────────────────────────────────────────
export default function AboutClient({
  initialProfile,
}: {
  initialProfile: ProfileData | null;
}) {
  const [profileId, setProfileId] = useState<string | null>(
    initialProfile?.id ?? null,
  );

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [saving0, setSaving0] = useState(false);

  const [role, setRole] = useState(initialProfile?.role ?? "");
  const [tags, setTags] = useState<string[]>(initialProfile?.tags ?? []);
  const [quote, setQuote] = useState(initialProfile?.quote ?? "");
  const [saving1, setSaving1] = useState(false);
  const [initialHeroUrl, setInitialHeroUrl] = useState<string | null>(
    initialProfile?.hero_url ?? null,
  );

  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [saving2, setSaving2] = useState(false);
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(
    initialProfile?.avatar_url ?? null,
  );

  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [saving4, setSaving4] = useState(false);

  const [socials, setSocials] = useState<string[]>(
    initialProfile?.socials ?? [],
  );
  const [saving3, setSaving3] = useState(false);

  const [contact, setContact] = useState<string[]>(
    initialProfile?.contact ?? [],
  );
  const [saving5, setSaving5] = useState(false);

  const uploadHeroRef = useRef<
    | ((
        currentPath?: string | null,
      ) => Promise<UploadResult | null | undefined>)
    | null
  >(null);
  const uploadAvatarRef = useRef<
    | ((
        currentPath?: string | null,
      ) => Promise<UploadResult | null | undefined>)
    | null
  >(null);

  const { toast, showToast } = useToast();

  async function handleSave0() {
    setSaving0(true);
    try {
      const result = await saveNameSection(profileId, { full_name: fullName });
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Nama tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving0(false);
    }
  }

  async function handleSave1() {
    setSaving1(true);
    try {
      const uploadResult = await uploadHeroRef.current?.(
        initialHeroUrl
          ? decodeURIComponent(
              initialHeroUrl.split("/about-images/")[1]?.split("?")[0] ?? "",
            )
          : null,
      );
      const heroUrl =
        uploadResult !== undefined
          ? (uploadResult?.url ?? null)
          : initialHeroUrl;
      const result = await saveHeroSection(profileId, {
        role,
        tags,
        quote,
        hero_url: heroUrl,
      });
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      if (heroUrl !== initialHeroUrl) setInitialHeroUrl(heroUrl);
      showToast("Hero section tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving1(false);
    }
  }

  async function handleSave2() {
    setSaving2(true);
    try {
      const uploadResult = await uploadAvatarRef.current?.(
        initialAvatarUrl
          ? decodeURIComponent(
              initialAvatarUrl.split("/about-images/")[1]?.split("?")[0] ?? "",
            )
          : null,
      );
      const avatarUrl =
        uploadResult !== undefined
          ? (uploadResult?.url ?? null)
          : initialAvatarUrl;
      const result = await saveAboutSection(profileId, {
        bio,
        avatar_url: avatarUrl,
      });
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      if (avatarUrl !== initialAvatarUrl) setInitialAvatarUrl(avatarUrl);
      showToast("About Me tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving2(false);
    }
  }

  async function handleSave3() {
    setSaving3(true);
    try {
      const result = await saveSocials(profileId, socials);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Social media tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving3(false);
    }
  }

  async function handleSave4() {
    setSaving4(true);
    try {
      const result = await saveSkills(profileId, skills);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Skills tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving4(false);
    }
  }

  async function handleSave5() {
    setSaving5(true);
    try {
      const result = await saveContact(profileId, contact);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Kontak tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      setSaving5(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
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
            margin: "0 0 6px",
          }}
        >
          Profile
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
          Informasi dasar yang akan ditampilkan di seluruh halaman portfolio.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        {/* Section 1: Nama */}
        <CollapsibleSection
          title="Profile"
          subtitle="Informasi dasar yang akan ditampilkan di seluruh halaman portfolio."
          icon={FiUser}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input
                className="field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama yang ingin ditampilkan"
              />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 6,
                }}
              >
                Nama ini akan digunakan sebagai identitas utama pada portfolio
                dan halaman publik.
              </p>
            </div>
            <SaveButton saving={saving0} onClick={handleSave0} />
          </div>
        </CollapsibleSection>

        {/* Section 2: Hero & Identity */}
        <CollapsibleSection
          title="Hero Section"
          subtitle="Perkenalkan diri Anda melalui headline, minat, dan visual utama."
          icon={FiActivity}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <FieldLabel>Professional Title</FieldLabel>
              <input
                className="field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Frontend Developer, UI Designer, Full Stack Developer"
              />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 6,
                }}
              >
                Judul singkat yang menjelaskan bidang atau peran utama Anda.
              </p>
            </div>
            <div style={{ height: 1, background: "var(--border-subtle)" }} />
            <div>
              <FieldLabel>Interests</FieldLabel>
              <TagInput tags={tags} onChange={setTags} />
            </div>
            <div style={{ height: 1, background: "var(--border-subtle)" }} />
            <div>
              <FieldLabel>Headline</FieldLabel>
              <textarea
                className="field"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Satu kalimat singkat yang menggambarkan diri atau cara Anda bekerja"
                rows={3}
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 6,
                }}
              >
                Headline akan membantu pengunjung memahami siapa Anda dalam
                beberapa detik pertama.
              </p>
            </div>
            <div style={{ height: 1, background: "var(--border-subtle)" }} />
            <div>
              <FieldLabel>Hero Banner</FieldLabel>
              <HeroImageField
                key={initialHeroUrl ?? "__none__"}
                initialPreview={initialHeroUrl}
                onUpload={(fn) => {
                  uploadHeroRef.current = fn;
                }}
              />
            </div>
            <SaveButton saving={saving1} onClick={handleSave1} />
          </div>
        </CollapsibleSection>

        {/* Section 3: About Me */}
        <CollapsibleSection
          title="About"
          subtitle="Ceritakan pengalaman, ketertarikan, dan perjalanan Anda secara singkat."
          icon={FiBookOpen}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              alignItems: "start",
            }}
            className="about-grid"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel>About Me</FieldLabel>
              <textarea
                className="field"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan tentang diri Anda, pengalaman, minat, atau tujuan yang sedang Anda kejar."
                rows={10}
                style={{ resize: "vertical", lineHeight: 1.7, minHeight: 220 }}
              />
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Bagian ini membantu pengunjung memahami latar belakang dan
                kepribadian Anda.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel>Profile Photo</FieldLabel>
              <AvatarImageField
                key={initialAvatarUrl ?? "__none__"}
                initialPreview={initialAvatarUrl}
                onUpload={(fn) => {
                  uploadAvatarRef.current = fn;
                }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: 24,
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: 20,
            }}
          >
            <SaveButton saving={saving2} onClick={handleSave2} />
          </div>
        </CollapsibleSection>

        {/* Section 4: Skills */}
        <CollapsibleSection
          title="Skills"
          subtitle="Daftar kemampuan, teknologi, dan tools yang Anda kuasai."
          icon={FiCpu}
          badge={skills.length > 0 ? `${skills.length} skill` : undefined}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SkillsInput skills={skills} onChange={setSkills} />
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 16,
              }}
            >
              <SaveButton saving={saving4} onClick={handleSave4} />
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 5: Social Media */}
        <CollapsibleSection
          title="Social Links"
          subtitle="Tambahkan platform yang ingin Anda tampilkan kepada pengunjung."
          icon={FiShare2}
          badge={socials.length > 0 ? `${socials.length} link` : undefined}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SocialsInput links={socials} onChange={setSocials} />
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 16,
              }}
            >
              <SaveButton saving={saving3} onClick={handleSave3} />
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 6: Contact */}
        <CollapsibleSection
          title="Contact"
          subtitle="Informasi yang dapat digunakan untuk menghubungi Anda."
          icon={FiPhone}
          badge={contact.length > 0 ? `${contact.length} kontak` : undefined}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ContactInput entries={contact} onChange={setContact} />
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 16,
              }}
            >
              <SaveButton saving={saving5} onClick={handleSave5} />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        ${TOAST_KEYFRAMES}
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .field { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}
