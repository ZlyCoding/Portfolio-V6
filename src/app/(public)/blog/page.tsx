import { createServerSupabaseClient } from "@/lib/supabase/server";
import Navbar from "../_components/Navbar";
import BlogCard from "../_components/BlogCard";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, image_url, featured, created_at",
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const allPosts = posts ?? [];

  return (
    <main style={{ background: "#0e0e10", minHeight: "100svh" }}>
      <Navbar mode="page" />

      {/* Hero header */}
      <div
        style={{
          padding:
            "clamp(100px, 14vw, 160px) clamp(24px, 8vw, 120px) clamp(40px, 6vw, 64px)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#7c6d9e",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>+</span> Blog
        </p>

        <h1
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#f0f0f0",
            margin: "0 0 20px",
          }}
        >
          Semua{" "}
          <em style={{ color: "#a89cc0", fontStyle: "italic" }}>Artikel</em>.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "15px",
            color: "rgba(240,240,240,0.5)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {allPosts.length} artikel ditemukan
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "0 clamp(24px, 8vw, 120px) clamp(60px, 8vw, 100px)",
        }}
      >
        {allPosts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {allPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} delay={0} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "15px",
              color: "rgba(240,240,240,0.3)",
            }}
          >
            Belum ada artikel yang dipublikasikan.
          </div>
        )}
      </div>
    </main>
  );
}
