import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, bio")
    .limit(1)
    .maybeSingle();

  const name = profile?.full_name ?? "Portfolio";
  const role = profile?.role ?? null;
  const bio = profile?.bio ?? "Personal Portfolio";

  const title = role ? `${name} — ${role}` : name;

  return {
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description: bio,
    openGraph: {
      title,
      description: bio,
    },
  };
}

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
