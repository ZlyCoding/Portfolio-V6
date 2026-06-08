"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  FiGrid,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiLogOut,
  FiLayers,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import type { User as SBUser } from "@supabase/supabase-js";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/admin/about", label: "Tentang Saya", icon: FiUser },
  { href: "/admin/projects", label: "Proyek", icon: FiBriefcase },
  { href: "/admin/blog", label: "Blog", icon: FiFileText },
];

function Sidebar({
  user,
  open,
  onClose,
}: {
  user: SBUser;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await createClient().auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const initials = (user.email ?? "AD").slice(0, 2).toUpperCase();
  const emailLabel =
    (user.email ?? "").length > 24
      ? user.email!.slice(0, 24) + "…"
      : (user.email ?? "");

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 45,
        overflowY: "auto",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        /* on mobile: slide in/out */
      }}
      className={`sidebar-panel${open ? " open" : ""}`}
    >
      {/* Brand */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "var(--crimson-muted)",
              border: "1px solid var(--crimson-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiLayers size={15} color="var(--crimson)" />
          </div>
          <div>
            <div
              className="font-display"
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-.01em",
                lineHeight: 1.2,
              }}
            >
              Portfolio
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--text-muted)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>
        {/* Close btn — mobile only */}
        <button
          onClick={onClose}
          className="close-sidebar-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 4,
            display: "none",
          }}
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px" }}>
        <p
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            padding: "0 10px",
            marginBottom: 8,
          }}
        >
          Menu
        </p>

        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                position: "relative",
                background: active ? "var(--crimson-muted)" : "transparent",
                border: `1px solid ${active ? "var(--crimson-border)" : "transparent"}`,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: "all .2s",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: "55%",
                    background: "var(--crimson)",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <Icon
                size={14}
                color={active ? "var(--crimson)" : "currentColor"}
              />
              <span>{label}</span>
              {active && (
                <FiChevronRight
                  size={11}
                  style={{ marginLeft: "auto", color: "var(--crimson)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 10px",
            borderRadius: 9,
            background: "rgba(255,255,255,.02)",
            border: "1px solid var(--border-subtle)",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "var(--crimson)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {emailLabel}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--crimson)",
                letterSpacing: ".06em",
              }}
            >
              Administrator
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          disabled={busy}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 7,
            background: "transparent",
            border: "1px solid transparent",
            color: "var(--text-muted)",
            fontSize: 12,
            cursor: "pointer",
            transition: "all .2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget;
            b.style.background = "rgba(220,20,60,.07)";
            b.style.color = "#f87171";
            b.style.borderColor = "rgba(220,20,60,.2)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.background = "transparent";
            b.style.color = "var(--text-muted)";
            b.style.borderColor = "transparent";
          }}
        >
          <FiLogOut size={13} />
          {busy ? "Keluar…" : "Keluar"}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-panel {
            transform: translateX(-100%);
            box-shadow: none;
          }
          .sidebar-panel.open {
            transform: translateX(0);
            box-shadow: 4px 0 40px rgba(0,0,0,.6);
          }
          .close-sidebar-btn { display: flex !important; }
        }
      `}</style>
    </aside>
  );
}

export default function AdminSidebar({
  user,
  children,
}: {
  user: SBUser;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // close sidebar on route change
  const pathname = usePathname();
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const initials = (user.email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar overlay — mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
          width: "100%",
        }}
        className="main-area"
      >
        {/* Mobile top bar */}
        <header className="mobile-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-primary)",
                padding: 6,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
              }}
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <span
              className="font-display"
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Portfolio
            </span>
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "var(--crimson)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main
          style={{ flex: 1, padding: "28px 24px", overflowX: "hidden" }}
          className="page-content"
        >
          {children}
        </main>
      </div>

      <style>{`
        /* Desktop: push content right of fixed sidebar */
        @media (min-width: 769px) {
          .main-area {
            margin-left: var(--sidebar-w);
            width: calc(100% - var(--sidebar-w));
          }
          .page-content {
            padding: 32px 36px !important;
            width: 100%;
            box-sizing: border-box;
          }
          .page-content > * {
            width: 100%;
          }
        }
        /* Mobile: top-bar visible, add top padding */
        @media (max-width: 768px) {
          .page-content {
            padding-top: calc(var(--header-h) + 20px) !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
