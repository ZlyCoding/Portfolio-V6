"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiAlertCircle,
  FiLayers,
} from "react-icons/fi";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/admin/dashboard";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/admin/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    errorParam === "unauthorized"
      ? "Akses ditolak. Akun ini tidak memiliki izin admin."
      : "",
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }
    try {
      const { error: err } = await createClient().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (err) {
        setError(
          err.message.includes("Invalid login")
            ? "Email atau password salah."
            : err.message.includes("Email not confirmed")
              ? "Email belum dikonfirmasi."
              : err.message,
        );
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,20,60,.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg,transparent,var(--crimson),transparent)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "all .55s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 13,
              background: "var(--crimson-muted)",
              border: "1px solid var(--crimson-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FiLayers size={20} color="var(--crimson)" />
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(22px, 5vw, 28px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "var(--text-primary)",
              letterSpacing: "-.02em",
              marginBottom: 6,
            }}
          >
            Admin Access
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 13,
              fontWeight: 300,
            }}
          >
            Masuk ke panel administrasi
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "clamp(24px, 5vw, 36px)",
            boxShadow: "var(--glow)",
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(220,20,60,.08)",
                border: "1px solid rgba(220,20,60,.28)",
                borderRadius: 8,
                padding: "11px 13px",
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#f87171",
                fontSize: 13,
              }}
            >
              <FiAlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 7,
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <FiMail
                  size={14}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="field"
                  style={{ paddingLeft: 38 }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 7,
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <FiLock
                  size={14}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="field"
                  style={{ paddingLeft: 38, paddingRight: 42 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "12px", marginTop: 4 }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 13,
                      height: 13,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin .75s linear infinite",
                    }}
                  />
                  Memproses…
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          Akun dibuat oleh administrator ·{" "}
          <span style={{ color: "var(--crimson-dim)" }}>
            Tidak ada registrasi publik
          </span>
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Memuat...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
