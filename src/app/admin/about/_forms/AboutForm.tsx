"use client";

import {
  FiUser,
  FiActivity,
  FiBookOpen,
  FiCpu,
  FiShare2,
  FiPhone,
} from "react-icons/fi";
import type { UploadResult } from "@/app/admin/_storage/useImageUpload";
import type { ImageFieldControls } from "../_components/AboutComponents";
import {
  CollapsibleSection,
  FieldLabel,
  SaveButton,
  TagInput,
  DraggableListInput,
  ImageField,
} from "../_components/AboutComponents";

// ── Profile Section ────────────────────────────────────────────────────────────
export function ProfileSection({
  fullName,
  setFullName,
  saving,
  onSave,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
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
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            Nama ini akan digunakan sebagai identitas utama pada portfolio dan
            halaman publik.
          </p>
        </div>
        <SaveButton saving={saving} onClick={onSave} />
      </div>
    </CollapsibleSection>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────────
export function HeroSection({
  role,
  setRole,
  tags,
  setTags,
  quote,
  setQuote,
  initialHeroUrl,
  saving,
  onSave,
  onUploadReady,
}: {
  role: string;
  setRole: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  quote: string;
  setQuote: (v: string) => void;
  initialHeroUrl: string | null;
  saving: boolean;
  onSave: () => void;
  onUploadReady: (controls: ImageFieldControls) => void;
}) {
  return (
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
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
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
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            Headline akan membantu pengunjung memahami siapa Anda dalam beberapa
            detik pertama.
          </p>
        </div>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />

        <div>
          <FieldLabel>Hero Banner</FieldLabel>
          <ImageField
            key={initialHeroUrl ?? "__none__"}
            initialPreview={initialHeroUrl}
            hint="Gambar utama yang akan tampil pada bagian atas halaman."
            onUpload={onUploadReady}
          />
        </div>

        <SaveButton saving={saving} onClick={onSave} />
      </div>
    </CollapsibleSection>
  );
}

// ── About Section ──────────────────────────────────────────────────────────────
export function AboutSection({
  bio,
  setBio,
  initialAvatarUrl,
  saving,
  onSave,
  onUploadReady,
}: {
  bio: string;
  setBio: (v: string) => void;
  initialAvatarUrl: string | null;
  saving: boolean;
  onSave: () => void;
  onUploadReady: (controls: ImageFieldControls) => void;
}) {
  return (
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
          <ImageField
            key={initialAvatarUrl ?? "__none__"}
            initialPreview={initialAvatarUrl}
            hint="Gunakan foto yang jelas dan representatif sebagai identitas utama Anda."
            onUpload={onUploadReady}
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
        <SaveButton saving={saving} onClick={onSave} />
      </div>
    </CollapsibleSection>
  );
}

// ── Skills Section ─────────────────────────────────────────────────────────────
export function SkillsSection({
  skills,
  setSkills,
  saving,
  onSave,
}: {
  skills: string[];
  setSkills: (v: string[]) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <CollapsibleSection
      title="Skills"
      subtitle="Daftar kemampuan, teknologi, dan tools yang Anda kuasai."
      icon={FiCpu}
      badge={skills.length > 0 ? `${skills.length} skill` : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DraggableListInput
          items={skills}
          onChange={setSkills}
          mode="text"
          addPlaceholder="React, Next.js, Flutter, Figma"
          hint="Tekan Enter untuk tambah. Drag untuk mengubah urutan."
        />
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: 16,
          }}
        >
          <SaveButton saving={saving} onClick={onSave} />
        </div>
      </div>
    </CollapsibleSection>
  );
}

// ── Socials Section ────────────────────────────────────────────────────────────
export function SocialsSection({
  socials,
  setSocials,
  saving,
  onSave,
}: {
  socials: string[];
  setSocials: (v: string[]) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <CollapsibleSection
      title="Social Links"
      subtitle="Tambahkan platform yang ingin Anda tampilkan kepada pengunjung."
      icon={FiShare2}
      badge={socials.length > 0 ? `${socials.length} link` : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DraggableListInput
          items={socials}
          onChange={setSocials}
          mode="input"
          placeholder="https://github.com/username"
          addPlaceholder="https://linkedin.com/in/username"
          hint="Link akan ditampilkan sebagai tombol sosial pada halaman portfolio."
        />
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: 16,
          }}
        >
          <SaveButton saving={saving} onClick={onSave} />
        </div>
      </div>
    </CollapsibleSection>
  );
}

// ── Contact Section ────────────────────────────────────────────────────────────
export function ContactSection({
  contact,
  setContact,
  saving,
  onSave,
}: {
  contact: string[];
  setContact: (v: string[]) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <CollapsibleSection
      title="Contact"
      subtitle="Informasi yang dapat digunakan untuk menghubungi Anda."
      icon={FiPhone}
      badge={contact.length > 0 ? `${contact.length} kontak` : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <DraggableListInput
          items={contact}
          onChange={setContact}
          mode="input"
          placeholder="email@example.com atau wa.me/+62 812 xxxx xxxx"
          addPlaceholder="email@example.com atau wa.me/+62 812 xxxx xxxx"
          hint="Pilih kontak yang aktif agar pengunjung dapat menghubungi Anda dengan mudah."
        />
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: 16,
          }}
        >
          <SaveButton saving={saving} onClick={onSave} />
        </div>
      </div>
    </CollapsibleSection>
  );
}
