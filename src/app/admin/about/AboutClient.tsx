"use client";

import { useState, useRef } from "react";
import type { ImageFieldControls } from "./_components/AboutComponents";
import { Toast, useToast, TOAST_KEYFRAMES } from "@/components/Toast";
import {
  saveNameSection,
  saveHeroSection,
  saveAboutSection,
  saveSocials,
  saveSkills,
  saveContact,
} from "./actions";
import type { ProfileData } from "./actions";
import {
  ProfileSection,
  HeroSection,
  AboutSection,
  SkillsSection,
  SocialsSection,
  ContactSection,
} from "./_forms/AboutForm";

export default function AboutClient({
  initialProfile,
}: {
  initialProfile: ProfileData | null;
}) {
  // ── State ──────────────────────────────────────────────────────────────────
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

  // ── Saving locks (synchronous guard against duplicate submits) ────────────
  const savingRef0 = useRef(false);
  const savingRef1 = useRef(false);
  const savingRef2 = useRef(false);
  const savingRef3 = useRef(false);
  const savingRef4 = useRef(false);
  const savingRef5 = useRef(false);

  const uploadHeroRef = useRef<ImageFieldControls | null>(null);
  const uploadAvatarRef = useRef<ImageFieldControls | null>(null);

  const { toast, showToast } = useToast();

  // ── Helpers ────────────────────────────────────────────────────────────────
  function extractStoragePath(url: string | null, bucket: string) {
    if (!url) return null;
    return decodeURIComponent(url.split(`/${bucket}/`)[1]?.split("?")[0] ?? "");
  }

  // ── Save Handlers ──────────────────────────────────────────────────────────
  async function handleSave0() {
    if (savingRef0.current) return;
    savingRef0.current = true;
    setSaving0(true);
    try {
      const result = await saveNameSection(profileId, { full_name: fullName });
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Nama tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef0.current = false;
      setSaving0(false);
    }
  }

  async function handleSave1() {
    if (savingRef1.current) return;
    savingRef1.current = true;
    setSaving1(true);
    try {
      const controls = uploadHeroRef.current;
      const uploadResult = await controls?.uploadToStorage(
        extractStoragePath(initialHeroUrl, "about-images"),
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
      if (!result.success) {
        // DB gagal setelah upload berhasil → hapus file orphan
        await controls?.rollbackUpload();
        throw new Error(result.error);
      }
      controls?.commitUpload();
      if (result.profileId && !profileId) setProfileId(result.profileId);
      if (heroUrl !== initialHeroUrl) setInitialHeroUrl(heroUrl);
      showToast("Hero section tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef1.current = false;
      setSaving1(false);
    }
  }

  async function handleSave2() {
    if (savingRef2.current) return;
    savingRef2.current = true;
    setSaving2(true);
    try {
      const controls = uploadAvatarRef.current;
      const uploadResult = await controls?.uploadToStorage(
        extractStoragePath(initialAvatarUrl, "about-images"),
      );
      const avatarUrl =
        uploadResult !== undefined
          ? (uploadResult?.url ?? null)
          : initialAvatarUrl;
      const result = await saveAboutSection(profileId, {
        bio,
        avatar_url: avatarUrl,
      });
      if (!result.success) {
        // DB gagal setelah upload berhasil → hapus file orphan
        await controls?.rollbackUpload();
        throw new Error(result.error);
      }
      controls?.commitUpload();
      if (result.profileId && !profileId) setProfileId(result.profileId);
      if (avatarUrl !== initialAvatarUrl) setInitialAvatarUrl(avatarUrl);
      showToast("About Me tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef2.current = false;
      setSaving2(false);
    }
  }

  async function handleSave3() {
    if (savingRef3.current) return;
    savingRef3.current = true;
    setSaving3(true);
    try {
      const result = await saveSocials(profileId, socials);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Social media tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef3.current = false;
      setSaving3(false);
    }
  }

  async function handleSave4() {
    if (savingRef4.current) return;
    savingRef4.current = true;
    setSaving4(true);
    try {
      const result = await saveSkills(profileId, skills);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Skills tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef4.current = false;
      setSaving4(false);
    }
  }

  async function handleSave5() {
    if (savingRef5.current) return;
    savingRef5.current = true;
    setSaving5(true);
    try {
      const result = await saveContact(profileId, contact);
      if (!result.success) throw new Error(result.error);
      if (result.profileId && !profileId) setProfileId(result.profileId);
      showToast("Kontak tersimpan!", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    } finally {
      savingRef5.current = false;
      setSaving5(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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

      {/* Sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        <ProfileSection
          fullName={fullName}
          setFullName={setFullName}
          saving={saving0}
          onSave={handleSave0}
        />

        <HeroSection
          role={role}
          setRole={setRole}
          tags={tags}
          setTags={setTags}
          quote={quote}
          setQuote={setQuote}
          initialHeroUrl={initialHeroUrl}
          saving={saving1}
          onSave={handleSave1}
          onUploadReady={(controls) => {
            uploadHeroRef.current = controls;
          }}
        />

        <AboutSection
          bio={bio}
          setBio={setBio}
          initialAvatarUrl={initialAvatarUrl}
          saving={saving2}
          onSave={handleSave2}
          onUploadReady={(controls) => {
            uploadAvatarRef.current = controls;
          }}
        />

        <SkillsSection
          skills={skills}
          setSkills={setSkills}
          saving={saving4}
          onSave={handleSave4}
        />

        <SocialsSection
          socials={socials}
          setSocials={setSocials}
          saving={saving3}
          onSave={handleSave3}
        />

        <ContactSection
          contact={contact}
          setContact={setContact}
          saving={saving5}
          onSave={handleSave5}
        />
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
