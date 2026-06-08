import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, bio, quote")
    .limit(1)
    .maybeSingle();

  const name = profile?.full_name ?? "Portfolio";
  const role = profile?.role ?? null;
  const bio = profile?.bio ?? null;
  const quote = profile?.quote ?? null;

  const title = role ? `${name} — ${role}` : name;

  const description =
    quote ??
    (bio
      ? bio.slice(0, 155).trimEnd() + (bio.length > 155 ? "…" : "")
      : `Portfolio of ${name}`);

  return {
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
