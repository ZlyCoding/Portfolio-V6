"use client";

import { useEffect, useRef, useState } from "react";
import {
  estimateReadTime,
  estimateReadTimeFromExcerpt,
} from "@/lib/utils/readTime";

export interface PublicPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  image_url: string | null;
  featured: boolean;
  created_at: string;
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
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
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface BlogCardProps {
  post: PublicPost;
  delay?: number;
}

export default function BlogCard({ post, delay = 0 }: BlogCardProps) {
  const [hovered, setHovered] = useState(false);
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // Pakai content jika tersedia (lebih akurat), fallback ke estimasi dari excerpt
  const readTime = post.content
    ? estimateReadTime(post.content)
    : estimateReadTimeFromExcerpt(post.excerpt);

  return (
    <a
      href={`/blog/${post.slug}`}
      style={{
        textDecoration: "none",
        display: "block",
        flex: "1 1 300px",
        maxWidth: "420px",
      }}
    >
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "28px 28px 24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 16px 48px rgba(0,0,0,0.18)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          transform: vis
            ? hovered
              ? "translateY(-4px)"
              : "translateY(0)"
            : "translateY(24px)",
          opacity: vis ? 1 : 0,
          transition: `opacity 0.6s ${delay}s ease, transform 0.5s ease, box-shadow 0.3s ease`,
        }}
      >
        {/* Thumbnail */}
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a89cc0, #7c6d9e)",
              flexShrink: 0,
            }}
          />
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "18px",
            fontWeight: 700,
            color: "#111111",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "13.5px",
              color: "#666666",
              margin: 0,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Divider */}
        <div
          style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }}
        />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#999999",
              fontSize: "12px",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <CalendarIcon />
              {formatDate(post.created_at)}
            </span>
            <span style={{ color: "#d0d0d0" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ClockIcon />
              {readTime} min read
            </span>
          </div>
          <span
            style={{
              color: "#7c6d9e",
              display: "flex",
              alignItems: "center",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.2s ease",
            }}
          >
            <ArrowIcon />
          </span>
        </div>
      </div>
    </a>
  );
}
