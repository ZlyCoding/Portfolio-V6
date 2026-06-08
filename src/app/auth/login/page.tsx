"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiAlertCircle,
  FiLayers,
  FiShield,
} from "react-icons/fi";

// ─── Konfigurasi Rate Limit ───────────────────────────────────────────────────
const MAX_ATTEMPTS = 5; // maks percobaan gagal
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 menit (ms)
const STORAGE_KEY = "login_attempts";

interface AttemptData {
  count: number;
  lockedUntil: number | null; // timestamp (ms), null = belum dikunci
}

function getAttemptData(): AttemptData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    return JSON.parse(raw) as AttemptData;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttemptData(data: AttemptData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silent
  }
}

function resetAttempts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silent
  }
}

// Format sisa waktu lockout ke string "MM:SS"
function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
// ─────────────────────────────────────────────────────────────────────────────

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

  // Rate limit state
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");

  // Baca state lockout dari localStorage saat mount
  useEffect(() => {
    setReady(true);
    const data = getAttemptData();
    if (data.lockedUntil && data.lockedUntil > Date.now()) {
      setLockedUntil(data.lockedUntil);
      setAttemptsLeft(0);
    } else if (data.lockedUntil && data.lockedUntil <= Date.now()) {
      // Lockout sudah expired, reset
      resetAttempts();
    } else {
      setAttemptsLeft(MAX_ATTEMPTS - data.count);
    }
  }, []);

  // Countdown timer saat dikunci
  const updateCountdown = useCallback(() => {
    if (!lockedUntil) return;
    const remaining = lockedUntil - Date.now();
    if (remaining <= 0) {
      setLockedUntil(null);
      setAttemptsLeft(MAX_ATTEMPTS);
      setError("");
      resetAttempts();
    } else {
      setCountdown(formatCountdown(remaining));
    }
  }, [lockedUntil]);

  useEffect(() => {
    if (!lockedUntil) return;
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil, updateCountdown]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Cek lockout
    if (lockedUntil && lockedUntil > Date.now()) {
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${countdown}.`);
      return;
    }

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
        // Hitung percobaan gagal
        const data = getAttemptData();
        const newCount = data.count + 1;

        if (newCount >= MAX_ATTEMPTS) {
          // Kunci!
          const lockUntil = Date.now() + LOCKOUT_DURATION;
          saveAttemptData({ count: newCount, lockedUntil: lockUntil });
          setLockedUntil(lockUntil);
          setAttemptsLeft(0);
          setError(
            `Terlalu banyak percobaan gagal. Akun dikunci selama 15 menit.`,
          );
        } else {
          saveAttemptData({ count: newCount, lockedUntil: null });
          const left = MAX_ATTEMPTS - newCount;
          setAttemptsLeft(left);
          setError(
            err.message.includes("Invalid login")
              ? `Email atau password salah. Sisa percobaan: ${left}.`
              : err.message.includes("Email not confirmed")
                ? "Email belum dikonfirmasi."
                : err.message,
          );
        }
        return;
      }

      // Login sukses — reset percobaan
      resetAttempts();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const isLocked = !!(lockedUntil && lockedUntil > Date.now());

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
          {/* Lockout banner */}
          {isLocked && (
            <div
              style={{
                background: "rgba(220,20,60,.12)",
                border: "1px solid rgba(220,20,60,.4)",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              <FiShield size={22} color="#f87171" style={{ marginBottom: 8 }} />
              <p
                style={{
                  color: "#f87171",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Akun sementara dikunci
              </p>
              <p style={{ color: "#fca5a5", fontSize: 12 }}>
                Terlalu banyak percobaan gagal. Coba lagi dalam:
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 6,
                  letterSpacing: "0.05em",
                }}
              >
                {countdown}
              </p>
            </div>
          )}

          {/* Error biasa */}
          {error && !isLocked && (
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
                  disabled={loading || isLocked}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="field"
                  style={{
                    paddingLeft: 38,
                    opacity: isLocked ? 0.45 : 1,
                    cursor: isLocked ? "not-allowed" : "text",
                  }}
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
                  disabled={loading || isLocked}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="field"
                  style={{
                    paddingLeft: 38,
                    paddingRight: 42,
                    opacity: isLocked ? 0.45 : 1,
                    cursor: isLocked ? "not-allowed" : "text",
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  disabled={isLocked}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: isLocked ? "not-allowed" : "pointer",
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
              disabled={loading || isLocked}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 4,
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
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
              ) : isLocked ? (
                <>
                  <FiShield size={14} />
                  Dikunci
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
