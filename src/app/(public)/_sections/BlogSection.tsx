"use client";

import { useEffect, useRef, useState } from "react";
import BlogCard, { type PublicPost } from "../_components/BlogCard";

interface BlogSectionProps {
  posts: PublicPost[];
}

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

export default function BlogSection({ posts }: BlogSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const displayPosts = posts.slice(0, 5);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#0e0e10",
        padding: "100px clamp(24px, 8vw, 120px) clamp(40px, 6vw, 72px)",
        overflow: "hidden",
      }}
    >
      {/* Gradient fade from ProjectsSection (#f7f6f4) to dark */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "160px",
          background: "linear-gradient(to bottom, #f7f6f4 0%, #0e0e10 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Dot grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Sparkles */}
      <Sparkle
        size={14}
        color="#7c6d9e"
        style={{
          position: "absolute",
          top: "60px",
          left: "clamp(24px,8vw,120px)",
          opacity: 0.8,
          zIndex: 1,
        }}
      />
      <Sparkle
        size={10}
        color="#a89cc0"
        style={{
          position: "absolute",
          top: "160px",
          right: "120px",
          opacity: 0.6,
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          marginBottom: "60px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#7c6d9e",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease",
          }}
        >
          <span style={{ fontSize: "14px" }}>+</span> Blog
        </p>

        <h2
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#f0f0f0",
            margin: "0 0 22px",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s 0.2s ease, transform 0.8s 0.2s ease",
          }}
        >
          Pikiran &amp;{" "}
          <em style={{ color: "#a89cc0", fontStyle: "italic" }}>Cerita</em>.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "15px",
            color: "rgba(240,240,240,0.55)",
            lineHeight: 1.7,
            margin: 0,
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease",
          }}
        >
          Catatan perjalanan saya dalam belajar,
          <br />
          membangun produk, dan memecahkan masalah.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "36px",
        }}
      >
        {displayPosts.length > 0
          ? displayPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} delay={0.1 + i * 0.1} />
            ))
          : [0, 1].map((i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "20px",
                  padding: "28px",
                  flex: "1 1 300px",
                  maxWidth: "420px",
                  minHeight: "200px",
                }}
              />
            ))}
      </div>

      {/* CTA Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            color: "#f0f0f0",
            border: "1.5px solid rgba(240,240,240,0.25)",
            padding: "16px 40px",
            borderRadius: "100px",
            transition: "border-color 0.25s, background 0.25s",
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(16px)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "rgba(168,156,192,0.7)";
            el.style.background = "rgba(168,156,192,0.08)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "rgba(240,240,240,0.25)";
            el.style.background = "transparent";
          }}
        >
          Lihat Semua Artikel
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
}
