"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  fullName: string | null;
  role: string | null;
  tags: string[];
  quote: string | null;
  heroUrl: string | null;
}

/* ── Panel ───────────────────────────────────── */
function Panel({
  index,
  mounted,
  heroUrl,
  isMobile,
}: {
  index: number;
  mounted: boolean;
  heroUrl: string | null;
  isMobile: boolean;
}) {
  const desktopConfigs = [
    { w: 88, h: "520px", delay: 0.08 },
    { w: 102, h: "630px", delay: 0.2 },
    { w: 116, h: "720px", delay: 0.12 },
    { w: 126, h: "780px", delay: 0.05 },
    { w: 116, h: "720px", delay: 0.18 },
    { w: 102, h: "630px", delay: 0.28 },
    { w: 88, h: "520px", delay: 0.14 },
  ];
  const mobileConfigs = [
    { w: 36, h: "260px", delay: 0.08 },
    { w: 42, h: "310px", delay: 0.2 },
    { w: 48, h: "360px", delay: 0.12 },
    { w: 52, h: "390px", delay: 0.05 },
    { w: 48, h: "360px", delay: 0.18 },
    { w: 42, h: "310px", delay: 0.28 },
    { w: 36, h: "260px", delay: 0.14 },
  ];

  const configs = isMobile ? mobileConfigs : desktopConfigs;
  const { w, h, delay } = configs[index];

  const gap = isMobile ? 5 : 10;
  const widths = configs.map((c) => c.w);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * 6;

  const lefts = widths.reduce<number[]>((acc, _pw, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + widths[i - 1] + gap];
  }, []);

  const bgX = `-${lefts[index]}px`;
  const bgColor = `hsl(${220 + index * 15}, 15%, ${82 + index * 2}%)`;
  const isCenterPanel = index >= 2 && index <= 4;
  const glowShadow =
    "0 20px 56px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.07)";

  return (
    <div
      className="pub-panel"
      style={{
        position: "relative",
        width: `${w}px`,
        height: h,
        borderRadius: "5px",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 20px 56px rgba(0,0,0,0.14), 0 4px 14px rgba(0,0,0,0.07)",
        opacity: mounted ? 1 : 0,
        transform: mounted
          ? "translateY(0) scaleY(1)"
          : "translateY(30px) scaleY(0.92)",
        transition: `opacity 0.7s ${delay}s cubic-bezier(.22,.68,0,1.2), transform 0.75s ${delay}s cubic-bezier(.22,.68,0,1.2)`,
        background: heroUrl ? undefined : bgColor,
      }}
    >
      {heroUrl && (
        <div
          className="pub-panel-bg"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${totalW}px auto`,
            backgroundPosition: `${bgX} center`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
          borderRadius: "5px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.05), transparent)",
          pointerEvents: "none",
        }}
      />
      {isCenterPanel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,255,255,0.38) 0%, rgba(240,220,255,0.18) 40%, transparent 70%)",
            pointerEvents: "none",
            borderRadius: "5px",
          }}
        />
      )}
    </div>
  );
}

/* ── Hero Section ────────────────────────────── */
export default function HeroSection({
  fullName,
  role,
  tags,
  quote,
  heroUrl,
}: HeroSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const paraLeftRef = useRef<HTMLDivElement>(null);
  const paraRightRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e: MouseEvent) => {
      if (!panelRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      panelRef.current.style.transform = `translate(${dx * -10}px, ${dy * -6}px)`;
      // Jajar genjang parallax — arah berlawanan, speed lebih kenceng biar keliatan
      if (paraLeftRef.current) {
        paraLeftRef.current.style.transform = `skewX(-14deg) rotate(-4deg) translate(${dx * 18}px, ${dy * 12}px)`;
      }
      if (paraRightRef.current) {
        paraRightRef.current.style.transform = `skewX(-14deg) rotate(3deg) translate(${dx * 18}px, ${dy * 12}px)`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (panelRef.current) panelRef.current.style.transform = "";
      if (paraLeftRef.current)
        paraLeftRef.current.style.transform = "skewX(-14deg) rotate(-4deg)";
      if (paraRightRef.current)
        paraRightRef.current.style.transform = "skewX(-14deg) rotate(3deg)";
    };
  }, [isMobile]);

  const nameParts = fullName?.trim().split(" ") ?? [];
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0] || "Your";
  const lastName =
    nameParts.length > 1 ? nameParts[nameParts.length - 1] : null;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(170,150,210,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Blob Top-Left ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: isMobile ? "340px" : "520px",
          height: isMobile ? "340px" : "520px",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,182,193,0.55), rgba(255,105,135,0.25) 60%, transparent 80%)",
          filter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Blob Top-Right ──────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-100px",
          width: isMobile ? "220px" : "340px",
          height: isMobile ? "220px" : "340px",
          borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
          background:
            "radial-gradient(circle at 55% 35%, rgba(255,230,100,0.5), rgba(255,200,50,0.22) 60%, transparent 80%)",
          filter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Blob Bottom-Right ───────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-80px",
          width: isMobile ? "260px" : "380px",
          height: isMobile ? "260px" : "380px",
          borderRadius: "70% 30% 50% 50% / 40% 50% 50% 60%",
          background:
            "radial-gradient(circle at 45% 55%, rgba(255,160,180,0.5), rgba(255,100,130,0.2) 60%, transparent 80%)",
          filter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Blob Bottom-Left ────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: isMobile ? "180px" : "260px",
          height: isMobile ? "180px" : "260px",
          borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,220,80,0.45), rgba(255,190,40,0.18) 60%, transparent 80%)",
          filter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Dot Grid Top-Left ───────────────────── */}
      <svg
        style={{
          position: "absolute",
          top: isMobile ? "48px" : "72px",
          left: isMobile ? "48px" : "80px",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 0,
        }}
        width={isMobile ? "72" : "108"}
        height={isMobile ? "72" : "108"}
        viewBox="0 0 108 108"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle
              key={`tl-${row}-${col}`}
              cx={col * 24 + 6}
              cy={row * 24 + 6}
              r="1.8"
              fill="#b0a0c8"
            />
          )),
        )}
      </svg>

      {/* ── Dot Grid Bottom-Right ────────────────── */}
      <svg
        style={{
          position: "absolute",
          bottom: isMobile ? "48px" : "72px",
          right: isMobile ? "48px" : "80px",
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 0,
        }}
        width={isMobile ? "72" : "108"}
        height={isMobile ? "72" : "108"}
        viewBox="0 0 108 108"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle
              key={`br-${row}-${col}`}
              cx={col * 24 + 6}
              cy={row * 24 + 6}
              r="1.8"
              fill="#b0a0c8"
            />
          )),
        )}
      </svg>

      {/* Parallelogram Left — nempel ujung panel kiri, posisi atas */}
      {heroUrl && (
        <div
          ref={paraLeftRef}
          style={{
            position: "absolute",
            left: "calc(50% - 480px)",
            top: "clamp(100px, 18vh, 200px)",
            width: isMobile ? "80px" : "140px",
            height: isMobile ? "58px" : "100px",
            transform: "skewX(-14deg) rotate(-4deg)",
            overflow: "hidden",
            borderRadius: "4px",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.9s 0.45s ease, transform 0.15s ease-out",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-30%",
              backgroundImage: `url(${heroUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "15% 25%",
              transform: "skewX(14deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1.5px solid rgba(0,0,0,0.85)",
              borderRadius: "4px",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* Parallelogram Right — nempel ujung panel kanan, posisi bawah */}
      {heroUrl && (
        <div
          ref={paraRightRef}
          style={{
            position: "absolute",
            right: "calc(50% - 480px)",
            bottom: "clamp(80px, 14vh, 160px)",
            width: isMobile ? "80px" : "140px",
            height: isMobile ? "58px" : "100px",
            transform: "skewX(-14deg) rotate(3deg)",
            overflow: "hidden",
            borderRadius: "4px",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.9s 0.55s ease, transform 0.15s ease-out",
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-30%",
              backgroundImage: `url(${heroUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "85% 75%",
              transform: "skewX(14deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "1.5px solid rgba(0,0,0,0.85)",
              borderRadius: "4px",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* ── Orbital Ring BACK (belakang panels) ─── */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s 0.8s ease",
          overflow: "visible",
        }}
        width={isMobile ? "420" : "980"}
        height={isMobile ? "180" : "400"}
        viewBox="0 0 980 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Setengah atas ellipse — bagian yang "di belakang" panels */}
        <path
          d="M 20,200 A 470,185 0 0 1 960,200"
          fill="none"
          stroke="rgba(124,109,158,0.3)"
          strokeWidth="1.8"
        />
        {/* Sparkle atas — di belakang panels */}
        <g transform="translate(490, 15)">
          <path
            d="M0,-10 C1.3,-2.5 2.5,-1.3 10,0 C2.5,1.3 1.3,2.5 0,10 C-1.3,2.5 -2.5,1.3 -10,0 C-2.5,-1.3 -1.3,-2.5 0,-10Z"
            fill="#7c6d9e"
            opacity="0.7"
          />
        </g>
      </svg>

      {/* Panels */}
      <div
        ref={panelRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "5px" : "10px",
          zIndex: 1,
          transition: "transform 0.1s ease-out",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Panel
            key={i}
            index={i}
            mounted={mounted}
            heroUrl={heroUrl}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* ── Orbital Ring FRONT (depan panels) ───── */}
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s 0.8s ease",
          overflow: "visible",
        }}
        width={isMobile ? "420" : "980"}
        height={isMobile ? "180" : "400"}
        viewBox="0 0 980 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Setengah bawah ellipse — bagian yang "di depan" panels */}
        <path
          d="M 20,200 A 470,185 0 0 0 960,200"
          fill="none"
          stroke="rgba(124,109,158,0.3)"
          strokeWidth="1.8"
        />
        {/* Sparkle kanan — pink, di depan */}
        <g transform="translate(958, 202)">
          <path
            d="M0,-16 C2,-4 4,-2 16,0 C4,2 2,4 0,16 C-2,4 -4,2 -16,0 C-4,-2 -2,-4 0,-16Z"
            fill="#e86fa8"
          />
        </g>
        {/* Sparkle kiri — purple, di depan */}
        <g transform="translate(22, 198)">
          <path
            d="M0,-13 C1.6,-3.2 3.2,-1.6 13,0 C3.2,1.6 1.6,3.2 0,13 C-1.6,3.2 -3.2,1.6 -13,0 C-3.2,-1.6 -1.6,-3.2 0,-13Z"
            fill="#7c6d9e"
          />
        </g>
        {/* Dot bawah kanan */}
        <circle cx="820" cy="368" r="8" fill="#a78bca" opacity="0.85" />
        {/* Dot bawah kiri */}
        <circle cx="162" cy="368" r="6" fill="#b0a0c8" opacity="0.65" />
      </svg>

      {/* Name + role bottom-left */}
      <div
        style={{
          position: "absolute",
          left: "clamp(24px, 6vw, 80px)",
          bottom: "clamp(36px, 7vh, 80px)",
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.8s 0.6s ease, transform 0.8s 0.6s ease",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "8px",
          }}
        >
          {role ?? "Portfolio"}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(28px, 5.5vw, 68px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "#0d0d0d",
          }}
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <em style={{ fontStyle: "italic", color: "#6b5c91" }}>
                {lastName}
              </em>
            </>
          )}
        </h1>

        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "16px",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#6b5c91",
                  border: "1px solid rgba(107,92,145,0.45)",
                  borderRadius: "100px",
                  padding: "3px 10px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {quote && (
          <p
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "14px",
              fontStyle: "italic",
              color: "#999",
              marginTop: "14px",
              maxWidth: "320px",
              lineHeight: 1.6,
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>

      {/* Scroll hint bottom-right */}
      <div
        style={{
          position: "absolute",
          right: "clamp(24px, 6vw, 80px)",
          bottom: "32px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s 1s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#bbb",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "44px",
            background: "linear-gradient(to bottom, #bbb, transparent)",
            animation: "pubScrollLine 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
