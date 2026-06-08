"use client";

import { useEffect, useRef, useState } from "react";
import { PiStarFourFill, PiSparkleFill, PiSparkleLight } from "react-icons/pi";

const navLinks = [
  { label: "Home", hash: "#home" },
  { label: "About", hash: "#about" },
  { label: "Projects", hash: "#projects" },
  { label: "Blog", hash: "#blog" },
];

interface NavbarProps {
  mode?: "scroll" | "page"; // scroll = homepage (default), page = standalone page
}

export default function Navbar({ mode = "scroll" }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const mqHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", mqHandler);

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", mqHandler);
    };
  }, []);

  // collapse on outside tap
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [expanded]);

  useEffect(() => {
    if (mode !== "scroll") return;
    const sections = document.querySelectorAll("section[id]");
    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = "";
        let bestRatio = 0;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) {
          const matched = navLinks.find((l) => l.hash === `#${bestId}`);
          if (matched) setActive(matched.label);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: "-80px 0px 0px 0px",
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const getHref = (hash: string) => (mode === "page" ? `/${hash}` : hash);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (mode === "page") return; // let browser navigate normally
    e.preventDefault();
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setExpanded(false);
  };

  /* ── Mobile expandable pill ───────────────────── */
  if (isMobile) {
    return (
      <>
        <style>{`
          @keyframes sparkle-pulse {
            0%,100%{ opacity:1; transform:scale(1) rotate(0deg); }
            40%{ opacity:.5; transform:scale(.75) rotate(20deg); }
            70%{ opacity:.9; transform:scale(1.15) rotate(-10deg); }
          }
          @keyframes fade-in-left {
            from { opacity: 0; transform: translateX(8px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        <nav
          style={{
            position: "fixed",
            bottom: "calc(24px + env(safe-area-inset-bottom))",
            right: "20px",
            zIndex: 999,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s 0.2s ease",
          }}
        >
          <div
            ref={pillRef}
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* sparkle decorations — only when expanded */}
            {expanded && (
              <>
                <PiStarFourFill
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "-8px",
                    color: "#a78bca",
                    fontSize: "14px",
                    filter: "drop-shadow(0 0 4px rgba(167,139,202,.7))",
                    animation: "sparkle-pulse 2.4s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
                <PiSparkleFill
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "-4px",
                    color: "#c4a8e0",
                    fontSize: "16px",
                    filter: "drop-shadow(0 0 5px rgba(196,168,224,.75))",
                    animation: "sparkle-pulse 2.4s ease-in-out infinite 1.2s",
                    pointerEvents: "none",
                  }}
                />
              </>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(180,160,210,.30)",
                borderRadius: "100px",
                boxShadow:
                  "0 4px 24px rgba(107,92,145,.18), 0 1px 6px rgba(0,0,0,.08)",
                overflow: "hidden",
                // animate width: collapsed = 44px circle, expanded = auto
                width: expanded ? "auto" : "44px",
                height: "44px",
                transition: "width 0.4s cubic-bezier(0.34,1.28,0.64,1)",
                whiteSpace: "nowrap",
              }}
            >
              {/* Nav links — shown when expanded, slide in from right */}
              {expanded && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    paddingLeft: "6px",
                    animation: "fade-in-left 0.3s ease forwards",
                  }}
                >
                  {navLinks.map((link) => {
                    const isActive = mode === "scroll" && active === link.label;
                    return (
                      <a
                        key={link.label}
                        href={getHref(link.hash)}
                        onClick={(e) => handleClick(e, link.hash)}
                        style={{
                          fontFamily: "var(--font-dm-sans, sans-serif)",
                          fontSize: "11px",
                          fontWeight: isActive ? 600 : 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          padding: "7px 14px",
                          borderRadius: "100px",
                          color: isActive ? "#fff" : "#888",
                          background: isActive
                            ? "linear-gradient(135deg,#8b6fbd 0%,#6b5c91 100%)"
                            : "transparent",
                          boxShadow: isActive
                            ? "0 2px 10px rgba(107,92,145,.35)"
                            : "none",
                          transition: "all .2s ease",
                          flexShrink: 0,
                        }}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Toggle button — always visible, stays on the right */}
              <button
                onClick={() => setExpanded((p) => !p)}
                aria-label={expanded ? "Close menu" : "Open menu"}
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: expanded
                    ? "linear-gradient(135deg,#8b6fbd 0%,#6b5c91 100%)"
                    : "transparent",
                  border: "none",
                  borderRadius: "100px",
                  cursor: "pointer",
                  color: expanded ? "#fff" : "#7c6d9e",
                  transition: "background 0.3s ease, color 0.3s ease",
                  padding: 0,
                }}
              >
                {expanded ? (
                  /* X icon */
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 2L12 12M12 2L2 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <PiSparkleLight size={20} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }

  /* ── Desktop floating pill ────────────────────── */
  return (
    <nav
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.6s 0.3s ease",
      }}
    >
      <style>{`
        @keyframes sparkle-pulse {
          0%,100%{ opacity:1; transform:scale(1) rotate(0deg); }
          40%{ opacity:.5; transform:scale(.75) rotate(20deg); }
          70%{ opacity:.9; transform:scale(1.15) rotate(-10deg); }
        }
      `}</style>

      <div style={{ position: "relative", display: "inline-block" }}>
        <PiStarFourFill
          style={{
            position: "absolute",
            top: "-8px",
            left: "-8px",
            color: "#a78bca",
            fontSize: "16px",
            filter: "drop-shadow(0 0 4px rgba(167,139,202,.7))",
            animation: "sparkle-pulse 2.4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <PiSparkleFill
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            color: "#c4a8e0",
            fontSize: "18px",
            filter: "drop-shadow(0 0 5px rgba(196,168,224,.75))",
            animation: "sparkle-pulse 2.4s ease-in-out infinite 1.2s",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            background: scrolled
              ? "rgba(255,255,255,0.82)"
              : "rgba(255,255,255,0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(180,160,210,.25)",
            borderRadius: "100px",
            padding: "5px 6px",
            boxShadow: scrolled
              ? "0 8px 32px rgba(107,92,145,.12), 0 2px 8px rgba(0,0,0,.06)"
              : "0 4px 20px rgba(107,92,145,.08), 0 1px 4px rgba(0,0,0,.04)",
            transition: "background .3s ease, box-shadow .3s ease",
          }}
        >
          {navLinks.map((link) => {
            const isActive = mode === "scroll" && active === link.label;
            return (
              <a
                key={link.label}
                href={getHref(link.hash)}
                onClick={(e) => handleClick(e, link.hash)}
                style={{
                  position: "relative",
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  padding: "7px 18px",
                  borderRadius: "100px",
                  color: isActive ? "#fff" : "#888",
                  background: isActive
                    ? "linear-gradient(135deg,#8b6fbd 0%,#6b5c91 100%)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 2px 10px rgba(107,92,145,.35)"
                    : "none",
                  transition: "all .25s ease",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
