export default function BlogPostCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="blog-post-card"
      style={{
        width: "100%",
        maxWidth: "780px",
        position: "relative",
      }}
    >
      <style>{`
        @media (min-width: 640px) {
          .blog-post-card {
            background: #13121a;
            border: 1px solid rgba(168,156,192,0.18);
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.55), 0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
            overflow: hidden;
          }
          .blog-accent-line { display: block !important; }
        }
      `}</style>

      {/* Garis aksen tipis di sisi kiri — hanya muncul di desktop */}
      <div
        className="blog-accent-line"
        style={{
          display: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background:
            "linear-gradient(to bottom, #7c6d9e 0%, rgba(124,109,158,0.3) 60%, transparent 100%)",
          borderRadius: "20px 0 0 20px",
        }}
      />

      {children}
    </div>
  );
}
