import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostContent from "../../_components/BlogPostContent";
import BlogPostCard from "../../_components/BlogPostCard";
import type { Metadata } from "next";
import { estimateReadTime } from "@/lib/utils/readTime";
import { cache } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Cached query — hanya 1x hit ke Supabase per request ───────────────────────

const getPost = cache(async (slug: string) => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, excerpt, content, image_url, featured, created_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return data;
});

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title}`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const readTime = estimateReadTime(post.content);
  const formattedDate = formatDate(post.created_at);

  return (
    <main
      style={{
        background: "#0e0e10",
        minHeight: "100svh",
        /* subtle dot-grid background agar halaman tidak polos */
        backgroundImage:
          "radial-gradient(circle, rgba(124,109,158,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        padding:
          "clamp(60px, 8vw, 100px) clamp(0px, 4vw, 48px) clamp(60px, 8vw, 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ── Paper card (desktop) / flat layout (mobile) ────────────────────────── */}
      <BlogPostCard>
        {/* ── Header area ──────────────────────────────────────────────────────── */}
        <div
          className="blog-header-area"
          style={{
            padding: "0 0 clamp(20px, 3vw, 32px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .blog-header-area {
                padding: clamp(28px, 4vw, 48px) clamp(28px, 4vw, 52px) clamp(20px, 3vw, 32px) !important;
              }
            }
          `}</style>
          {/* Back link + Featured badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <a
              href="/blog"
              className="opacity-85 hover:opacity-100 transition-opacity"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7c6d9e",
                textDecoration: "none",
              }}
            >
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Kembali ke Blog
            </a>

            {post.featured && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: "rgba(168,156,192,0.12)",
                  border: "1px solid rgba(168,156,192,0.3)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#a89cc0">
                  <path d="M12 2C12.55 7.67 16.33 11.45 22 12C16.33 12.55 12.55 16.33 12 22C11.45 16.33 7.67 12.55 2 12C7.67 11.45 11.45 7.67 12 2Z" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#a89cc0",
                    fontWeight: 500,
                  }}
                >
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "clamp(24px, 3.2vw, 40px)",
              fontWeight: 300,
              lineHeight: 1.15,
              color: "#f0f0f0",
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "13px",
                color: "rgba(240,240,240,0.45)",
              }}
            >
              <svg
                width="13"
                height="13"
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
              {formattedDate}
            </span>

            <span style={{ color: "rgba(240,240,240,0.2)", fontSize: "13px" }}>
              ·
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "13px",
                color: "rgba(240,240,240,0.45)",
              }}
            >
              <svg
                width="13"
                height="13"
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
              {readTime} min read
            </span>
          </div>
        </div>

        {/* ── Cover image ──────────────────────────────────────────────────────── */}
        {post.image_url && (
          <div style={{ lineHeight: 0 }}>
            <img
              src={post.image_url}
              alt={post.title}
              style={{
                width: "100%",
                height: "clamp(200px, 30vw, 320px)",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* ── Content area ─────────────────────────────────────────────────────── */}
        <div
          className="blog-content-area"
          style={{
            padding: "clamp(28px, 4vw, 48px) 0 clamp(36px, 5vw, 60px)",
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .blog-content-area {
                padding: clamp(28px, 4vw, 48px) clamp(28px, 4vw, 52px) clamp(36px, 5vw, 60px) !important;
              }
            }
          `}</style>
          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "clamp(14px, 1.4vw, 16px)",
                color: "rgba(240,240,240,0.6)",
                lineHeight: 1.7,
                marginBottom: "32px",
                fontStyle: "italic",
                borderLeft: "3px solid #7c6d9e",
                paddingLeft: "16px",
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Markdown content */}
          <BlogPostContent content={post.content ?? ""} />
        </div>

        {/* ── Footer strip ─────────────────────────────────────────────────────── */}
        <div
          className="blog-footer-strip"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .blog-footer-strip {
                padding: 16px clamp(28px, 4vw, 52px) !important;
              }
            }
          `}</style>
          <a
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#7c6d9e",
              textDecoration: "none",
              opacity: 0.8,
            }}
          >
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Semua Postingan
          </a>

          <span
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "11px",
              color: "rgba(240,240,240,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            {formattedDate}
          </span>
        </div>
      </BlogPostCard>
    </main>
  );
}
