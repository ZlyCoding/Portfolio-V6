export default function SettingsPage() {
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(24px,4vw,32px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-.03em",
            marginBottom: 6,
          }}
        >
          Pengaturan
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Konfigurasi website
        </p>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 32,
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        🚧 Halaman ini akan dikembangkan berikutnya
      </div>
    </div>
  );
}
