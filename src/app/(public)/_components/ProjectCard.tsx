"use client";

export interface PublicProject {
  id: string;
  title: string;
  description: string;
  type: string;
  live_url: string;
  github_url: string;
  image_url: string | null;
  featured: boolean;
}

// ── Icon helpers ────────────────────────────────────────────────────────────────

function ExternalIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M2 12L12 2M12 2H5M12 2V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ── Featured Card ───────────────────────────────────────────────────────────────

export function FeaturedProjectCard({
  project,
  visible,
}: {
  project: PublicProject;
  visible: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease",
        height: "260px",
      }}
    >
      {/* Left — Image Preview */}
      <div
        style={{
          position: "relative",
          background: "#0d0d12",
          overflow: "hidden",
        }}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          /* placeholder gradient */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #1a1528 0%, #2d1f4e 50%, #1a1528 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "48px",
                color: "rgba(255,255,255,0.06)",
                userSelect: "none",
              }}
            >
              {project.title[0]}
            </span>
          </div>
        )}
        {/* subtle vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent 70%, rgba(255,255,255,0.04))",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Right — Info */}
      <div
        style={{
          padding: "12px 16px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        {/* Top */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(124,109,158,0.1)",
              border: "1px solid rgba(124,109,158,0.2)",
              borderRadius: "100px",
              padding: "4px 12px",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7c6d9e",
              }}
            >
              Featured Project
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: "clamp(20px, 2vw, 28px)",
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.15,
              marginBottom: "6px",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "13px",
              color: "#777",
              lineHeight: 1.7,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Bottom — CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                color: "#7c6d9e",
                border: "1px solid rgba(124,109,158,0.4)",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                padding: "9px 18px",
                borderRadius: "100px",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(124,109,158,0.7)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#5e4f80";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(124,109,158,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#7c6d9e";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              Live Demo
              <ExternalIcon size={12} />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                color: "#444",
                border: "1px solid rgba(0,0,0,0.13)",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                padding: "9px 18px",
                borderRadius: "100px",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(0,0,0,0.28)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#111";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(0,0,0,0.13)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#444";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              View on GitHub
              <GithubIcon size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Other Project Row Card ──────────────────────────────────────────────────────

export function OtherProjectCard({
  project,
  index,
  visible,
}: {
  project: PublicProject;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="pub-other-project-row"
      style={{
        display: "grid",
        gridTemplateColumns: "88px 1fr auto",
        alignItems: "center",
        gap: "14px",
        padding: "14px",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-16px)",
        transition: `opacity 0.6s ${0.35 + index * 0.1}s ease, transform 0.6s ${0.35 + index * 0.1}s ease`,
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 20px rgba(124,109,158,0.12), 0 1px 4px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(124,109,158,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 10px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,0,0,0.07)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          height: "56px",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#1a1528",
          flexShrink: 0,
        }}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1a1528, #2d1f4e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: "22px",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              {project.title[0]}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0, maxWidth: "600px" }}>
        {/* Title + Tag inline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {project.featured && (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="#f59e0b"
                style={{ flexShrink: 0 }}
                aria-label="Featured"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            <span
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111",
              }}
            >
              {project.title}
            </span>
          </div>
          {project.type && (
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7c6d9e",
                background: "rgba(124,109,158,0.08)",
                border: "1px solid rgba(124,109,158,0.15)",
                borderRadius: "100px",
                padding: "2px 8px",
                flexShrink: 0,
              }}
            >
              {project.type}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "11.5px",
            color: "#888",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          {project.description}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            title="Live Demo"
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "8px",
              color: "#666",
              textDecoration: "none",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#7c6d9e";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(124,109,158,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(124,109,158,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#666";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(0,0,0,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            <ExternalIcon size={13} />
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "8px",
              color: "#666",
              textDecoration: "none",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#111";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(0,0,0,0.25)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#666";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(0,0,0,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            <GithubIcon size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
