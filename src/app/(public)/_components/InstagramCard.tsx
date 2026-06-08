"use client";

import { useEffect, useRef, useState } from "react";
import { getSkillIcon, parseSocials, parseContacts } from "@/lib/utils/icons";

export interface InstagramCardProps {
  avatarUrl: string | null;
  fullName: string | null;
  role: string | null;
  bio: string | null;
  tags: string[];
  location: string | null;
  vis: boolean;
  isMobile: boolean;
  skills?: string[] | null;
  socials?: string[] | null;
  contact?: string[] | null;
}

/* ── Mobile Bio Below Image ──────────────────── */
function MobileBioOverlay({
  bio,
  tags,
  username,
}: {
  bio: string | null;
  tags: string[];
  username: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const BIO_PREVIEW_LEN = 60;
  const bioText = bio || "Cerita tentang dirimu akan muncul di sini.";
  const showMore = bioText.length > BIO_PREVIEW_LEN;
  const bioDisplay =
    !expanded && showMore ? bioText.slice(0, BIO_PREVIEW_LEN) + "…" : bioText;

  return (
    <div style={{ padding: "10px 13px 4px", background: "#fff" }}>
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "12px",
          color: "#0d0d0d",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        <strong style={{ marginRight: 5 }}>{username}</strong>
        {bioDisplay}
        {showMore && !expanded && (
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{
              background: "none",
              border: "none",
              color: "#999",
              fontSize: "12px",
              cursor: "pointer",
              padding: 0,
              marginLeft: 4,
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontWeight: 400,
            }}
          >
            selengkapnya
          </button>
        )}
        {(expanded || !showMore) && tags.length > 0 && (
          <span style={{ color: "#6b5c91", marginLeft: 4 }}>
            {tags.map((tag) => `#${tag}`).join(" ")}
          </span>
        )}
        {expanded && showMore && (
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{
              background: "none",
              border: "none",
              color: "#999",
              fontSize: "12px",
              cursor: "pointer",
              padding: 0,
              marginLeft: 4,
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontWeight: 400,
            }}
          >
            sembunyikan
          </button>
        )}
      </p>
    </div>
  );
}

/* ── Slide 2: Skills — capsule light theme ───── */
function SkillsSlide({ skills }: { skills: string[] }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f8f7fc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle bg glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,109,158,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "9px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(107,92,145,0.5)",
          marginBottom: "16px",
          marginTop: 0,
          position: "relative",
        }}
      >
        Tech Stack
      </p>

      {skills.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "12px",
            color: "#bbb",
          }}
        >
          Belum ada skills
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            width: "100%",
            maxHeight: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {skills.slice(0, 12).map((skill) => {
            const IconComp = getSkillIcon(skill);
            return (
              <div
                key={skill}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "100px",
                  background: "#fff",
                  border: "1px solid rgba(124,109,158,0.18)",
                  boxShadow: "0 1px 4px rgba(107,92,145,0.07)",
                }}
              >
                <IconComp
                  size={14}
                  style={{ color: "#7c6d9e", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#444",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {skill}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Slide 3: Socials + Contact ──────────────── */
function ConnectSlide({
  parsedSocials,
  parsedContacts,
}: {
  parsedSocials: ReturnType<typeof parseSocials>;
  parsedContacts: ReturnType<typeof parseContacts>;
}) {
  const hasSocials = parsedSocials.length > 0;
  const hasContacts = parsedContacts.length > 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f8f7fc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        gap: "28px",
      }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,109,158,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Socials block */}
      {hasSocials && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "9px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(107,92,145,0.5)",
              margin: 0,
            }}
          >
            Social Media
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
            }}
          >
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
                  gap: "7px",
                  padding: "7px 14px",
                  borderRadius: "100px",
                  background: "#fff",
                  border: "1px solid rgba(124,109,158,0.18)",
                  boxShadow: "0 1px 4px rgba(107,92,145,0.07)",
                  color: "#7c6d9e",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                <Icon size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#444",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {hasSocials && hasContacts && (
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(124,109,158,0.2)",
            position: "relative",
          }}
        />
      )}

      {/* Contact block */}
      {hasContacts && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "9px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(107,92,145,0.5)",
              margin: 0,
            }}
          >
            Let&apos;s Connect
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
            }}
          >
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
                  gap: "7px",
                  padding: "7px 14px",
                  borderRadius: "100px",
                  background: "#fff",
                  border: "1px solid rgba(124,109,158,0.18)",
                  boxShadow: "0 1px 4px rgba(107,92,145,0.07)",
                  color: "#7c6d9e",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                <Icon size={14} />
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#444",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Instagram Card ───────────────────────────── */
export default function InstagramCard({
  avatarUrl,
  fullName,
  role,
  bio,
  tags,
  location,
  vis,
  isMobile,
  skills,
  socials,
  contact,
}: InstagramCardProps) {
  const [views, setViews] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const parsedSocials = parseSocials(socials);
  const parsedContacts = parseContacts(contact);
  const hasConnectSlide =
    isMobile && (parsedSocials.length > 0 || parsedContacts.length > 0);

  // Desktop: 1 slide | Mobile: photo + skills + connect (if data exists)
  const TOTAL_SLIDES = isMobile ? (hasConnectSlide ? 3 : 2) : 1;

  const skillList = skills ?? [];

  useEffect(() => {
    setViews((Math.floor(Math.random() * 8000) + 1500).toLocaleString("id-ID"));
    setCommentCount(Math.floor(Math.random() * 200) + 30);
  }, []);

  /* ── Mouse parallax (desktop photo slide only) ── */
  useEffect(() => {
    if (isMobile || currentSlide !== 0) return;
    const wrap = imgWrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0;
    const STRENGTH = 14,
      LERP = 0.07;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * STRENGTH;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2 * STRENGTH;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      if (imgRef.current)
        imgRef.current.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.08)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (imgRef.current)
        imgRef.current.style.transform = "translate(0,0) scale(1.08)";
    };
  }, [isMobile, currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0 && currentSlide < TOTAL_SLIDES - 1)
        setCurrentSlide((s) => s + 1);
      else if (dx > 0 && currentSlide > 0) setCurrentSlide((s) => s - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const goNext = () =>
    setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  const goPrev = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  const username = (fullName || "username")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  const locationText = location || role || "Creator";

  return (
    <div
      style={{
        opacity: vis ? 1 : 0,
        transform: vis
          ? "translateY(0) scale(1)"
          : "translateY(32px) scale(0.97)",
        transition: "opacity 0.8s 0.15s ease, transform 0.8s 0.15s ease",
        width: isMobile ? "100%" : "420px",
        maxWidth: isMobile ? "380px" : "420px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          border: "1px solid rgba(0,0,0,0.09)",
          overflow: "hidden",
          boxShadow: "0 4px 40px rgba(0,0,0,0.18), 0 1px 8px rgba(0,0,0,0.08)",
          fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 13px 9px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: avatarUrl
                ? undefined
                : "linear-gradient(135deg, #1a1625, #2d2040)",
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0d0d0d",
                  letterSpacing: "-0.01em",
                }}
              >
                {username}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="#3797F0" />
                <path
                  d="M4 7.2L6 9.2L10 5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#666",
                display: "block",
                marginTop: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {locationText}
            </span>
          </div>
          <div style={{ display: "flex", gap: 3.5, padding: "4px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#333",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
          ref={imgWrapRef}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#f0f0f0",
            cursor: isMobile ? "grab" : "default",
            userSelect: "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              display: "flex",
              width: `${TOTAL_SLIDES * 100}%`,
              height: "100%",
              transform: `translateX(-${(currentSlide * 100) / TOTAL_SLIDES}%)`,
              transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Slide 1: Photo */}
            <div
              style={{
                width: `${100 / TOTAL_SLIDES}%`,
                height: "100%",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {avatarUrl ? (
                <img
                  ref={imgRef}
                  src={avatarUrl}
                  alt={fullName ?? "avatar"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    transform: "translate(0,0) scale(1.08)",
                    willChange: "transform",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}
                >
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 48 48"
                    fill="none"
                    opacity="0.3"
                  >
                    <circle
                      cx="24"
                      cy="18"
                      r="9"
                      stroke="#999"
                      strokeWidth="2"
                    />
                    <path
                      d="M6 42c0-9.94 8.06-18 18-18s18 8.06 18 18"
                      stroke="#999"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Slide 2: Skills (mobile only) */}
            {isMobile && (
              <div
                style={{
                  width: `${100 / TOTAL_SLIDES}%`,
                  height: "100%",
                  flexShrink: 0,
                }}
              >
                <SkillsSlide skills={skillList} />
              </div>
            )}

            {/* Slide 3: Connect (mobile only, if data) */}
            {isMobile && hasConnectSlide && (
              <div
                style={{
                  width: `${100 / TOTAL_SLIDES}%`,
                  height: "100%",
                  flexShrink: 0,
                }}
              >
                <ConnectSlide
                  parsedSocials={parsedSocials}
                  parsedContacts={parsedContacts}
                />
              </div>
            )}
          </div>

          {/* Desktop nav arrows */}
          {!isMobile && (
            <>
              {currentSlide > 0 && (
                <button
                  onClick={goPrev}
                  aria-label="Previous slide"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.88)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.18)",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.88)")
                  }
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M7.5 2L3.5 6L7.5 10"
                      stroke="#0d0d0d"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              {currentSlide < TOTAL_SLIDES - 1 && (
                <button
                  onClick={goNext}
                  aria-label="Next slide"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.88)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.18)",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.88)")
                  }
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 2L8.5 6L4.5 10"
                      stroke="#0d0d0d"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Slide dots ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            padding: "8px 0 4px",
            background: "#fff",
          }}
        >
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? "16px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === currentSlide ? "#0d0d0d" : "rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>

        {/* ── Action bar ── */}
        <div style={{ padding: "9px 13px 4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "7px",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="#0d0d0d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="#0d0d0d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <line
                x1="22"
                y1="2"
                x2="11"
                y2="13"
                stroke="#0d0d0d"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon
                points="22 2 15 22 11 13 2 9 22 2"
                stroke="#0d0d0d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ flex: 1 }} />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke="#0d0d0d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0d0d0d",
              margin: "0 0 3px",
            }}
          >
            {views ?? "—"} views
          </p>

          {!isMobile && (
            <>
              <p
                style={{
                  fontSize: 12,
                  color: "#0d0d0d",
                  margin: "0 0 3px",
                  lineHeight: 1.45,
                }}
              >
                <strong>{username}</strong> Check my tech stack bro! 🔥
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#999",
                  margin: "0 0 9px",
                  cursor: "pointer",
                }}
              >
                View {commentCount ?? "—"} all comments
              </p>
            </>
          )}
        </div>

        {/* Mobile: bio */}
        {isMobile && (
          <MobileBioOverlay bio={bio} tags={tags} username={username} />
        )}
      </div>
    </div>
  );
}
