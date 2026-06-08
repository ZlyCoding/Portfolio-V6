"use client";

import { useEffect, useRef, useState } from "react";
import InstagramCard from "../_components/InstagramCard";
import { parseSocials, parseContacts, getSkillIcon } from "@/lib/utils/icons";

interface AboutSectionProps {
  avatarUrl: string | null;
  fullName: string | null;
  role: string | null;
  bio: string | null;
  tags: string[];
  location: string | null;
  skills?: string[] | null;
  socials?: string[] | null;
  contact?: string[] | null;
}

/* ── Bio Panel (Desktop only) ─────────────────── */
function BioPanelDesktop({
  fullName,
  role,
  bio,
  vis,
  socials,
  skills,
  contact,
}: Pick<
  AboutSectionProps,
  "fullName" | "role" | "bio" | "socials" | "skills" | "contact"
> & {
  vis: boolean;
}) {
  const parsedSocials = parseSocials(socials);
  const parsedContacts = parseContacts(contact);
  const skillList = skills ?? [];

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateX(0)" : "translateX(40px)",
        transition: "opacity 0.8s 0.35s ease, transform 0.8s 0.35s ease",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#7c6d9e",
          marginBottom: "20px",
        }}
      >
        Tentang Saya
      </p>

      <h2
        style={{
          fontFamily: "var(--font-cormorant, serif)",
          fontSize: "clamp(36px, 5vw, 72px)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "#f0f0f0",
          marginBottom: "28px",
          letterSpacing: "-0.01em",
        }}
      >
        {fullName ? (
          <em style={{ color: "#a89cc0", fontStyle: "italic" }}>{fullName}</em>
        ) : (
          <>
            Seorang <em style={{ color: "#a89cc0" }}>kreator</em> yang
            <br />
            membangun hal indah
          </>
        )}
      </h2>

      {/* Role badge + social icons row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        {role && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(124,109,158,0.12)",
              border: "1px solid rgba(124,109,158,0.25)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#a89cc0",
                animation: "aboutPulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "12px",
                fontWeight: 600,
                color: "#a89cc0",
                letterSpacing: "0.06em",
              }}
            >
              {role}
            </span>
          </div>
        )}

        {/* Social icons */}
        {parsedSocials.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {parsedSocials.map(({ platform, label, url, Icon }) => (
              <a
                key={platform + url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(124,109,158,0.10)",
                  border: "1px solid rgba(124,109,158,0.20)",
                  color: "rgba(240,240,240,0.55)",
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(124,109,158,0.25)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "#a89cc0";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(124,109,158,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(124,109,158,0.10)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(240,240,240,0.55)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(124,109,158,0.20)";
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        )}

        {/* Divider + Let's Connect */}
        {parsedContacts.length > 0 && (
          <>
            {/* vertical divider */}
            <div
              style={{
                width: "1px",
                height: "28px",
                background: "rgba(124,109,158,0.25)",
                flexShrink: 0,
              }}
            />

            {/* Let's Connect label + contact icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(168,156,192,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                Let&apos;s Connect
              </span>
              {parsedContacts.map(({ label, href, Icon }) => (
                <a
                  key={label + href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(124,109,158,0.08)",
                    border: "1px solid rgba(124,109,158,0.18)",
                    color: "rgba(240,240,240,0.50)",
                    textDecoration: "none",
                    transition:
                      "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(124,109,158,0.25)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#a89cc0";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(124,109,158,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(124,109,158,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(240,240,240,0.50)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(124,109,158,0.18)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "16px",
          lineHeight: 2,
          color: "rgba(240,240,240,0.55)",
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {bio ||
          "Isi tentang diri kamu di sini. Ceritakan siapa kamu, apa yang kamu kerjakan, dan apa yang membuat karya kamu unik."}
      </p>

      <div
        style={{
          marginTop: "40px",
          height: "1px",
          background:
            "linear-gradient(to right, rgba(124,109,158,0.4), transparent)",
        }}
      />

      {/* ── Tech Stack (Desktop) ── */}
      {skillList.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#7c6d9e",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Keahlian Utama
          </p>

          {/* Row 1 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {skillList
              .slice(0, Math.ceil(skillList.length / 2))
              .map((skill) => {
                const IconComp = getSkillIcon(skill);
                return (
                  <div
                    key={skill}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "7px 14px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      transition: "background 0.2s, border-color 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(124,109,158,0.15)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(124,109,158,0.40)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255,255,255,0.10)";
                    }}
                  >
                    <IconComp
                      size={16}
                      style={{ color: "rgba(168,156,192,0.9)", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "rgba(240,240,240,0.75)",
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {skill}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {skillList.slice(Math.ceil(skillList.length / 2)).map((skill) => {
              const IconComp = getSkillIcon(skill);
              return (
                <div
                  key={skill}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    transition: "background 0.2s, border-color 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(124,109,158,0.15)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(124,109,158,0.40)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(255,255,255,0.10)";
                  }}
                >
                  <IconComp
                    size={16}
                    style={{ color: "rgba(168,156,192,0.9)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "rgba(240,240,240,0.75)",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {skill}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── About Section ────────────────────────────── */
export default function AboutSection({
  avatarUrl,
  fullName,
  role,
  bio,
  tags,
  location,
  skills,
  socials,
  contact,
}: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100svh",
        background: "#0e0e10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "80px 24px 60px" : "80px clamp(32px, 5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid — top left */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "220px",
          height: "220px",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 0% 0%, black 30%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Dot grid — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "220px",
          height: "220px",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 100% 100%, black 30%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Background glows */}
      {/* Purple glow — top right */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-150px",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(100,60,180,0.45) 0%, rgba(80,40,160,0.18) 40%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />
      {/* Pink/magenta glow — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,60,140,0.35) 0%, rgba(160,40,120,0.14) 40%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? "0px" : "clamp(40px, 5vw, 80px)",
          width: "100%",
          maxWidth: "1320px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <InstagramCard
          avatarUrl={avatarUrl}
          fullName={fullName}
          role={role}
          bio={bio}
          tags={tags}
          location={location}
          vis={vis}
          isMobile={isMobile}
          skills={skills}
          socials={socials}
          contact={contact}
        />

        {!isMobile && (
          <BioPanelDesktop
            fullName={fullName}
            role={role}
            bio={bio}
            vis={vis}
            socials={socials}
            skills={skills}
            contact={contact}
          />
        )}
      </div>

      <style>{`
        @keyframes aboutPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}
