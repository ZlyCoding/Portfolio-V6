import { createServerSupabaseClient } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin";

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // ── Fetch counts ────────────────────────────────────────────────────────────
  const [
    { count: projectTotalCount },
    { count: projectPublishedCount },
    { count: blogTotalCount },
    { count: blogPublishedCount },
    { count: messageCount },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .then((res) => ({ count: res.error ? 0 : (res.count ?? 0) })),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .then((res) => ({ count: res.error ? 0 : (res.count ?? 0) })),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .then((res) => ({ count: res.error ? 0 : (res.count ?? 0) })),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .then((res) => ({ count: res.error ? 0 : (res.count ?? 0) })),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .then((res) => ({ count: res.error ? 0 : (res.count ?? 0) })),
  ]);

  return (
    <DashboardClient
      displayName={displayName}
      lastSignIn={lastSignIn}
      counts={{
        projectsTotal: projectTotalCount ?? 0,
        projectsPublished: projectPublishedCount ?? 0,
        blogTotal: blogTotalCount ?? 0,
        blogPublished: blogPublishedCount ?? 0,
        messages: messageCount ?? 0,
      }}
    />
  );
}
