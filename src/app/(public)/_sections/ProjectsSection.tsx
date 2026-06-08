"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import type { PublicProject } from "../_components/ProjectCard";
import {
  FeaturedProjectCard,
  OtherProjectCard,
} from "../_components/ProjectCard";

interface ProjectsSectionProps {
  projects: PublicProject[];
}

// ── Sparkle ───────────────────────────────────────────────────────────────────

function Sparkle({
  size = 16,
  color = "#7c6d9e",
  style,
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <path
        d="M12 2C12.55 7.67 16.33 11.45 22 12C16.33 12.55 12.55 16.33 12 22C11.45 16.33 7.67 12.55 2 12C7.67 11.45 11.45 7.67 12 2Z"
        fill={color}
      />
    </svg>
  );
}

// ── Chevron Icon ──────────────────────────────────────────────────────────────

function ChevronIcon({
  direction,
  size = 16,
}: {
  direction: "left" | "right";
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {direction === "left" ? (
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M6 3L11 8L6 13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

// ── Other Projects Carousel ───────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

function OtherProjectsCarousel({
  projects,
  visible,
  labelSlot,
}: {
  projects: PublicProject[];
  visible: boolean;
  labelSlot?: React.ReactNode;
}) {
  const [page, setPage] = useState(0);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const currentItems = projects.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  const goNext = useCallback(() => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  }, [page, totalPages]);

  const goPrev = useCallback(() => {
    if (page > 0) setPage((p) => p - 1);
  }, [page]);

  // Reset to page 0 when projects change, also clear locked height
  useEffect(() => {
    setPage(0);
    setLockedHeight(null);
  }, [projects.length]);

  // Measure and lock the height once the first (full) page has rendered
  useEffect(() => {
    if (lockedHeight !== null) return; // already locked
    if (page !== 0) return; // only measure page 0
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        setLockedHeight(h);
        ro.disconnect();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [page, lockedHeight]);

  // ── Header row: label (left) + nav buttons (right) ──
  const headerRow =
    totalPages > 1 ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s 0.5s ease",
        }}
      >
        {/* Left: label slot */}
        <div>{labelSlot}</div>

        {/* Right: prev / next buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={goPrev}
            disabled={page === 0}
            aria-label="Previous page"
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor:
                page === 0 ? "rgba(0,0,0,0.07)" : "rgba(124,109,158,0.35)",
              borderRadius: "8px",
              background: "transparent",
              color: page === 0 ? "#ccc" : "#7c6d9e",
              cursor: page === 0 ? "not-allowed" : "pointer",
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (page === 0) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(124,109,158,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(124,109,158,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                page === 0 ? "rgba(0,0,0,0.07)" : "rgba(124,109,158,0.35)";
            }}
          >
            <ChevronIcon direction="left" size={15} />
          </button>

          <button
            onClick={goNext}
            disabled={page === totalPages - 1}
            aria-label="Next page"
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor:
                page === totalPages - 1
                  ? "rgba(0,0,0,0.07)"
                  : "rgba(124,109,158,0.35)",
              borderRadius: "8px",
              background: "transparent",
              color: page === totalPages - 1 ? "#ccc" : "#7c6d9e",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (page === totalPages - 1) return;
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(124,109,158,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(124,109,158,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                page === totalPages - 1
                  ? "rgba(0,0,0,0.07)"
                  : "rgba(124,109,158,0.35)";
            }}
          >
            <ChevronIcon direction="right" size={15} />
          </button>
        </div>
      </div>
    ) : (
      <div style={{ marginBottom: "14px" }}>{labelSlot}</div>
    );

  if (totalPages <= 1) {
    // No pagination needed — just render all
    return (
      <div>
        {headerRow}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {projects.map((project, i) => (
            <OtherProjectCard
              key={project.id}
              project={project}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header: label + nav buttons ──────── */}
      {headerRow}

      {/* ── Carousel track ───────────────────── */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minHeight: lockedHeight != null ? `${lockedHeight}px` : undefined,
        }}
      >
        {currentItems.map((project, i) => (
          <OtherProjectCard
            key={project.id}
            project={project}
            index={i}
            visible={visible}
          />
        ))}
      </div>

      {/* ── Dot indicators (center) ──────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "16px",
          gap: "6px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s 0.5s ease",
        }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            style={{
              width: i === page ? "20px" : "6px",
              height: "6px",
              borderRadius: "100px",
              border: "none",
              background: i === page ? "#7c6d9e" : "rgba(124,109,158,0.25)",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s ease, background 0.3s ease",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────────

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const featuredProject = projects.find((p) => p.featured) ?? projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject?.id);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100svh",
        background: "#f7f6f4",
        padding: "80px clamp(24px, 8vw, 120px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background: dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(124,109,158,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Background: diagonal lines top-right */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "340px",
          height: "340px",
          opacity: 0.07,
          pointerEvents: "none",
        }}
        viewBox="0 0 340 340"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={i * 22 - 100}
            y1={0}
            x2={i * 22 + 240}
            y2={340}
            stroke="#7c6d9e"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* ── Background: diagonal lines bottom-left */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "260px",
          height: "260px",
          opacity: 0.05,
          pointerEvents: "none",
        }}
        viewBox="0 0 260 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={i * 22 - 80}
            y1={0}
            x2={i * 22 + 180}
            y2={260}
            stroke="#7c6d9e"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* ── Corner bracket top-left */}
      <svg
        style={{
          position: "absolute",
          top: "32px",
          left: "32px",
          opacity: 0.15,
          pointerEvents: "none",
        }}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 20 L0 0 L20 0"
          stroke="#7c6d9e"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* ── Corner bracket bottom-right */}
      <svg
        style={{
          position: "absolute",
          bottom: "32px",
          right: "32px",
          opacity: 0.15,
          pointerEvents: "none",
        }}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40 20 L40 40 L20 40"
          stroke="#7c6d9e"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* ── Floating squares */}
      <svg
        style={{
          position: "absolute",
          top: "18%",
          right: "6%",
          opacity: 0.08,
          pointerEvents: "none",
        }}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="28"
          height="28"
          stroke="#7c6d9e"
          strokeWidth="1.5"
        />
        <rect
          x="35"
          y="35"
          width="28"
          height="28"
          stroke="#7c6d9e"
          strokeWidth="1.5"
        />
        <rect
          x="18"
          y="18"
          width="28"
          height="28"
          stroke="#7c6d9e"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>

      <svg
        style={{
          position: "absolute",
          bottom: "22%",
          left: "4%",
          opacity: 0.07,
          pointerEvents: "none",
        }}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="20"
          height="20"
          stroke="#7c6d9e"
          strokeWidth="1.5"
        />
        <rect
          x="27"
          y="27"
          width="20"
          height="20"
          stroke="#7c6d9e"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── Soft glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,109,158,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "-60px",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,109,158,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ─────────────────────────────── */}
      <div
        style={{
          marginBottom: "24px",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <Sparkle size={12} color="#7c6d9e" />
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7c6d9e",
              fontWeight: 600,
            }}
          >
            Projects
          </p>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(32px, 5vw, 62px)",
            fontWeight: 400,
            color: "#111",
            lineHeight: 1.1,
            marginBottom: "10px",
          }}
        >
          Things I&apos;ve{" "}
          <em style={{ fontStyle: "italic", color: "#7c6d9e" }}>Built</em>.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "13px",
            color: "#999",
            maxWidth: "400px",
            lineHeight: 1.65,
          }}
        >
          Berbagai project yang telah saya buat, dari sekadar belajar hingga
          menjadi solusi nyata.
        </p>
      </div>

      {/* ── Featured Project ───────────────────── */}
      {featuredProject && (
        <div style={{ marginBottom: "16px" }}>
          <FeaturedProjectCard project={featuredProject} visible={vis} />
        </div>
      )}

      {/* ── Other Projects (Carousel) ──────────── */}
      {otherProjects.length > 0 && (
        <div>
          <OtherProjectsCarousel
            projects={otherProjects}
            visible={vis}
            labelSlot={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(10px)",
                  transition:
                    "opacity 0.6s 0.32s ease, transform 0.6s 0.32s ease",
                }}
              >
                <Sparkle size={10} color="#7c6d9e" />
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#bbb",
                  }}
                >
                  Other Projects
                </span>
                {otherProjects.length > ITEMS_PER_PAGE && (
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: "#7c6d9e",
                      background: "rgba(124,109,158,0.1)",
                      border: "1px solid rgba(124,109,158,0.18)",
                      borderRadius: "100px",
                      padding: "2px 8px",
                    }}
                  >
                    {otherProjects.length} total
                  </span>
                )}
              </div>
            }
          />
        </div>
      )}

      {/* ── Empty state ────────────────────────── */}
      {projects.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            opacity: vis ? 1 : 0,
            transition: "opacity 0.7s 0.2s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "18px",
              color: "#bbb",
              fontStyle: "italic",
            }}
          >
            Projects coming soon...
          </p>
        </div>
      )}

      {/* ── View More GitHub CTA ───────────────── */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s 0.55s ease, transform 0.6s 0.55s ease",
        }}
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#444",
            border: "1px solid rgba(0,0,0,0.14)",
            borderRadius: "100px",
            padding: "10px 22px",
            textDecoration: "none",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            transition: "border-color 0.2s, box-shadow 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "rgba(124,109,158,0.4)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#7c6d9e";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 4px 12px rgba(124,109,158,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor =
              "rgba(0,0,0,0.14)";
            (e.currentTarget as HTMLAnchorElement).style.color = "#444";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 1px 4px rgba(0,0,0,0.05)";
          }}
        >
          View More on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </section>
  );
}
