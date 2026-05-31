"use client";

import { useState, useCallback } from "react";
import { FiAlertCircle, FiStar } from "react-icons/fi";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ToastState {
  message: string;
  type: "success" | "error";
}

// ── Toast Component ────────────────────────────────────────────────────────────
export function Toast({ message, type }: ToastState) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        borderRadius: 10,
        background:
          type === "error" ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.12)",
        border: `1px solid ${type === "error" ? "rgba(239,68,68,.35)" : "rgba(34,197,94,.3)"}`,
        color: type === "error" ? "#f87171" : "#4ade80",
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 8px 32px rgba(0,0,0,.4)",
        backdropFilter: "blur(10px)",
        animation: "toastIn .25s ease",
      }}
    >
      {type === "error" ? <FiAlertCircle size={14} /> : <FiStar size={14} />}
      {message}
    </div>
  );
}

// ── Keyframes (inject sekali di layout atau pakai di masing-masing page) ───────
export const TOAST_KEYFRAMES = `@keyframes toastIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`;

// ── useToast Hook ──────────────────────────────────────────────────────────────
export function useToast(duration = 3500) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  return { toast, showToast };
}
