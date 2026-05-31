"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FiBriefcase,
  FiFileText,
  FiMail,
  FiUser,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiArrowUpRight,
  FiEdit3,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase";

function buildStats(counts: {
  projectsTotal: number;
  projectsPublished: number;
  blogTotal: number;
  blogPublished: number;
  messages: number;
}) {
  const projectsArchived = counts.projectsTotal - counts.projectsPublished;
  const blogArchived = counts.blogTotal - counts.blogPublished;
  return [
    {
      label: "Projects",
      value: counts.projectsTotal,
      icon: FiBriefcase,
      color: "#DC143C",
      bg: "rgba(220,20,60,.1)",
      trend:
        counts.projectsTotal === 0
          ? "No projects yet."
          : `${counts.projectsPublished} published · ${projectsArchived} archived`,
      href: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: counts.blogTotal,
      icon: FiFileText,
      color: "#e84c6b",
      bg: "rgba(232,76,107,.1)",
      trend:
        counts.blogTotal === 0
          ? "No posts yet."
          : `${counts.blogPublished} published · ${blogArchived} archived`,
      href: "/admin/blog",
    },
    {
      label: "Messages",
      value: counts.messages,
      icon: FiMail,
      color: "#c0392b",
      bg: "rgba(192,57,43,.1)",
      trend:
        counts.messages > 0
          ? `${counts.messages} message(s) received`
          : "No messages yet.",
      href: "/admin/messages",
    },
    {
      label: "Profile",
      value: 1,
      icon: FiUser,
      color: "#a93226",
      bg: "rgba(169,50,38,.1)",
      trend: "Manage your profile",
      href: "/admin/about",
    },
  ];
}

const quickActions = [
  {
    label: "Add Project",
    icon: FiBriefcase,
    href: "/admin/projects",
    desc: "Add a new project to your portfolio.",
  },
  {
    label: "New Post",
    icon: FiEdit3,
    href: "/admin/blog",
    desc: "Write a new blog post.",
  },
  {
    label: "Messages",
    icon: FiMail,
    href: "/admin/messages",
    desc: "View messages from visitors.",
  },
  {
    label: "Edit Profile",
    icon: FiUser,
    href: "/admin/about",
    desc: "Update your profile information.",
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function DashboardClient({
  displayName,
  lastSignIn,
  counts = {
    projectsTotal: 0,
    projectsPublished: 0,
    blogTotal: 0,
    blogPublished: 0,
    messages: 0,
  },
}: {
  displayName: string;
  lastSignIn: string | null;
  counts?: {
    projectsTotal: number;
    projectsPublished: number;
    blogTotal: number;
    blogPublished: number;
    messages: number;
  };
}) {
  const stats = buildStats(counts);
  const [sbStatus, setSbStatus] = useState<
    "idle" | "checking" | "ok" | "error"
  >("idle");

  const checkSupabase = useCallback(async () => {
    setSbStatus("checking");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("projects").select("id").limit(1);
      setSbStatus(error ? "error" : "ok");
    } catch {
      setSbStatus("error");
    }
  }, []);

  useEffect(() => {
    checkSupabase();
  }, [checkSupabase]);
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* ── Greeting ───────────────────────────────── */}
      <div
        className="anim-up"
        style={{
          marginBottom: 36,
          paddingBottom: 28,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {/* Top row: text only */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-.03em",
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {getGreeting()},{" "}
              <span style={{ color: "var(--crimson)", fontStyle: "italic" }}>
                {displayName}!
              </span>
            </h1>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                fontWeight: 300,
              }}
            >
              Berikut ringkasan konten portfolio Anda.
            </p>
          </div>
        </div>

        {lastSignIn && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            Last login: {lastSignIn}
          </div>
        )}
      </div>

      {/* ── Stats grid ─────────────────────────────── */}
      <div
        className="anim-up d-1 stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 28,
          width: "100%",
        }}
      >
        {stats.map(({ label, value, icon: Icon, color, bg, trend, href }) => (
          <a
            key={label}
            href={href}
            style={{ textDecoration: "none" }}
            className="card"
          >
            <div style={{ padding: "18px 16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={17} color={color} />
                </div>
                <FiArrowUpRight
                  size={13}
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-.02em",
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 7,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <FiTrendingUp size={9} />
                {trend}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Bottom section ─────────────────────────── */}
      <div
        className="anim-up d-2 bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          width: "100%",
          alignItems: "start",
        }}
      >
        {/* Quick actions */}
        <div>
          <h2
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </h2>
          <div
            className="actions-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {quickActions.map(({ label, icon: Icon, href, desc }) => (
              <a
                key={label}
                href={href}
                style={{ textDecoration: "none" }}
                className="card"
              >
                <div
                  style={{
                    padding: "15px 14px",
                    display: "flex",
                    gap: 11,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "var(--crimson-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={14} color="var(--crimson)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        lineHeight: 1.4,
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              System Status
            </h2>
            <button
              onClick={checkSupabase}
              disabled={sbStatus === "checking"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: sbStatus === "checking" ? "not-allowed" : "pointer",
                color: "var(--text-muted)",
                fontSize: 10,
                fontWeight: 500,
                opacity: sbStatus === "checking" ? 0.5 : 1,
                transition: "opacity .2s",
              }}
            >
              <FiRefreshCw
                size={10}
                style={{
                  animation:
                    sbStatus === "checking"
                      ? "spin 1s linear infinite"
                      : "none",
                }}
              />
              Refresh
            </button>
          </div>
          <div className="card" style={{ padding: "18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Database
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  color:
                    sbStatus === "ok"
                      ? "#4ade80"
                      : sbStatus === "error"
                        ? "#f87171"
                        : "var(--text-muted)",
                }}
              >
                {sbStatus === "ok" && (
                  <>
                    <FiCheckCircle size={10} /> Connected
                  </>
                )}
                {sbStatus === "error" && (
                  <>
                    <FiXCircle size={10} /> Error
                  </>
                )}
                {sbStatus === "checking" && <>Checking…</>}
                {sbStatus === "idle" && <>—</>}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .actions-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
