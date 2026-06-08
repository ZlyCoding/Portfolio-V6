import { createServerSupabaseClient } from "@/lib/supabase/server";
import HeroSection from "./_sections/HeroSection";
import AboutSection from "./_sections/AboutSection";
import ProjectsSection from "./_sections/ProjectsSection";
import BlogSection from "./_sections/BlogSection";
import Navbar from "./_components/Navbar";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: profile }, { data: projects }, { data: posts }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "full_name, role, tags, quote, hero_url, bio, avatar_url, socials, skills, contact",
        )
        .limit(1)
        .maybeSingle(),
      supabase
        .from("projects")
        .select(
          "id, title, description, type, live_url, github_url, image_url, featured",
        )
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("posts")
        .select(
          "id, title, slug, excerpt, content, image_url, featured, created_at",
        )
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

  return (
    <main style={{ overflowX: "hidden" }}>
      <Navbar />
      <section id="home">
        <HeroSection
          fullName={profile?.full_name ?? null}
          role={profile?.role ?? null}
          tags={profile?.tags ?? []}
          quote={profile?.quote ?? null}
          heroUrl={profile?.hero_url ?? null}
        />
      </section>
      <section id="about">
        <AboutSection
          avatarUrl={profile?.avatar_url ?? null}
          fullName={profile?.full_name ?? null}
          role={profile?.role ?? null}
          bio={profile?.bio ?? null}
          tags={profile?.tags ?? []}
          location={null}
          skills={profile?.skills ?? []}
          socials={profile?.socials ?? []}
          contact={profile?.contact ?? []}
        />
      </section>
      <section id="projects">
        <ProjectsSection projects={projects ?? []} />
      </section>
      <section id="blog">
        <BlogSection posts={posts ?? []} />
      </section>
    </main>
  );
}
