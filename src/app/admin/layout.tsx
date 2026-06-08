import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Panel Admin",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return <AdminSidebar user={user}>{children}</AdminSidebar>;
}
