"use client";

/**
 * BlogPostContent — renders Markdown content with custom styling
 * that matches the portfolio's dark aesthetic.
 *
 * Supported Markdown features:
 *  - # H1 / ## H2 / ### H3 / #### H4
 *  - **bold** / *italic* / ~~strikethrough~~
 *  - `inline code`
 *  - ```code blocks```
 *  - > blockquotes
 *  - - / * unordered lists
 *  - 1. ordered lists
 *  - [text](url) links
 *  - --- horizontal rules
 *  - ![alt](url) images
 *  - blank lines → paragraph breaks
 */

import React from "react";

// ── Token types ────────────────────────────────────────────────────────────────

type Block =
  | { type: "h1" | "h2" | "h3" | "h4"; children: Inline[] }
  | { type: "p"; children: Inline[] }
  | { type: "blockquote"; children: Inline[] }
  | { type: "code"; lang: string; code: string }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] }
  | { type: "hr" }
  | { type: "image"; src: string; alt: string };

type Inline =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "bold-italic"; value: string }
  | { type: "strike"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; href: string; label: string };

// ── Inline parser ──────────────────────────────────────────────────────────────

function parseInline(text: string): Inline[] {
  const tokens: Inline[] = [];
  let i = 0;

  while (i < text.length) {
    // Bold italic ***
    if (text.slice(i, i + 3) === "***") {
      const end = text.indexOf("***", i + 3);
      if (end !== -1) {
        tokens.push({ type: "bold-italic", value: text.slice(i + 3, end) });
        i = end + 3;
        continue;
      }
    }
    // Bold **
    if (text.slice(i, i + 2) === "**") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ type: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // Italic *
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1) {
        tokens.push({ type: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Italic _
    if (text[i] === "_" && text[i - 1] !== "_" && text[i + 1] !== "_") {
      const end = text.indexOf("_", i + 1);
      if (end !== -1) {
        tokens.push({ type: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Strikethrough ~~
    if (text.slice(i, i + 2) === "~~") {
      const end = text.indexOf("~~", i + 2);
      if (end !== -1) {
        tokens.push({ type: "strike", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // Inline code `
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        tokens.push({ type: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Link [text](url)
    if (text[i] === "[") {
      const labelEnd = text.indexOf("]", i);
      if (labelEnd !== -1 && text[labelEnd + 1] === "(") {
        const urlEnd = text.indexOf(")", labelEnd + 2);
        if (urlEnd !== -1) {
          const label = text.slice(i + 1, labelEnd);
          const href = text.slice(labelEnd + 2, urlEnd);
          tokens.push({ type: "link", href, label });
          i = urlEnd + 1;
          continue;
        }
      }
    }
    // Plain text — accumulate
    const last = tokens[tokens.length - 1];
    if (last?.type === "text") {
      last.value += text[i];
    } else {
      tokens.push({ type: "text", value: text[i] });
    }
    i++;
  }

  return tokens;
}

// ── Block parser ───────────────────────────────────────────────────────────────

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trimStart().startsWith("```")) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      i++;
      continue;
    }

    // HR ---
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Image ![alt](url)
    const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // Headings
    const h4 = line.match(/^#{4}\s+(.+)/);
    const h3 = line.match(/^#{3}\s+(.+)/);
    const h2 = line.match(/^#{2}\s+(.+)/);
    const h1 = line.match(/^#\s+(.+)/);
    if (h4) {
      blocks.push({ type: "h4", children: parseInline(h4[1]) });
      i++;
      continue;
    }
    if (h3) {
      blocks.push({ type: "h3", children: parseInline(h3[1]) });
      i++;
      continue;
    }
    if (h2) {
      blocks.push({ type: "h2", children: parseInline(h2[1]) });
      i++;
      continue;
    }
    if (h1) {
      blocks.push({ type: "h1", children: parseInline(h1[1]) });
      i++;
      continue;
    }

    // Blockquote >
    if (line.startsWith("> ")) {
      const text = line.slice(2);
      blocks.push({ type: "blockquote", children: parseInline(text) });
      i++;
      continue;
    }

    // Unordered list - / *
    if (/^(\s*[-*+]\s)/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^(\s*[-*+]\s)/.test(lines[i])) {
        const text = lines[i].replace(/^\s*[-*+]\s/, "");
        items.push(parseInline(text));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list 1.
    if (/^\d+\.\s/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s/, "");
        items.push(parseInline(text));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Empty line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — gather until blank line
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^(\s*[-*+]\s)/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*_]{3,}\s*$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", children: parseInline(paraLines.join(" ")) });
    }
  }

  return blocks;
}

// ── Security helpers ───────────────────────────────────────────────────────────

function isSafeHref(href: string): boolean {
  return (
    href.startsWith("/") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  );
}

function isSafeSrc(src: string): boolean {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  );
}

// ── Inline renderer ────────────────────────────────────────────────────────────

function RenderInline({ tokens }: { tokens: Inline[] }) {
  return (
    <>
      {tokens.map((tok, idx) => {
        switch (tok.type) {
          case "bold":
            return (
              <strong key={idx} style={{ fontWeight: 700, color: "#f0f0f0" }}>
                {tok.value}
              </strong>
            );
          case "italic":
            return (
              <em
                key={idx}
                style={{ fontStyle: "italic", color: "rgba(240,240,240,0.8)" }}
              >
                {tok.value}
              </em>
            );
          case "bold-italic":
            return (
              <strong
                key={idx}
                style={{
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#f0f0f0",
                }}
              >
                {tok.value}
              </strong>
            );
          case "strike":
            return (
              <del
                key={idx}
                style={{ textDecoration: "line-through", opacity: 0.5 }}
              >
                {tok.value}
              </del>
            );
          case "code":
            return (
              <code
                key={idx}
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
                  fontSize: "0.85em",
                  background: "rgba(168,156,192,0.15)",
                  border: "1px solid rgba(168,156,192,0.2)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  color: "#c4b5e8",
                }}
              >
                {tok.value}
              </code>
            );
          case "link": {
            if (!isSafeHref(tok.href))
              return <React.Fragment key={idx}>{tok.label}</React.Fragment>;
            return (
              <a
                key={idx}
                href={tok.href}
                target={tok.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  tok.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                style={{
                  color: "#a89cc0",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#c4b5e8")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#a89cc0")
                }
              >
                {tok.label}
              </a>
            );
          }
          default:
            return <React.Fragment key={idx}>{tok.value}</React.Fragment>;
        }
      })}
    </>
  );
}

// ── Block renderer ─────────────────────────────────────────────────────────────

const BASE_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans, sans-serif)",
  color: "rgba(240,240,240,0.75)",
  lineHeight: 1.8,
};

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h1":
      return (
        <h1
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 300,
            color: "#f0f0f0",
            lineHeight: 1.2,
            margin: "2em 0 0.5em",
            letterSpacing: "-0.01em",
          }}
        >
          <RenderInline tokens={block.children} />
        </h1>
      );
    case "h2":
      return (
        <h2
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(19px, 2.2vw, 26px)",
            fontWeight: 400,
            color: "#f0f0f0",
            lineHeight: 1.25,
            margin: "1.8em 0 0.4em",
            letterSpacing: "-0.005em",
          }}
        >
          <RenderInline tokens={block.children} />
        </h2>
      );
    case "h3":
      return (
        <h3
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            fontWeight: 700,
            color: "rgba(240,240,240,0.9)",
            lineHeight: 1.3,
            margin: "1.8em 0 0.5em",
          }}
        >
          <RenderInline tokens={block.children} />
        </h3>
      );
    case "h4":
      return (
        <h4
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            fontWeight: 700,
            color: "#a89cc0",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "1.6em 0 0.4em",
          }}
        >
          <RenderInline tokens={block.children} />
        </h4>
      );
    case "p":
      return (
        <p
          style={{
            ...BASE_TEXT,
            fontSize: "clamp(13px, 1.2vw, 15px)",
            margin: "0 0 1.2em",
          }}
        >
          <RenderInline tokens={block.children} />
        </p>
      );
    case "blockquote":
      return (
        <blockquote
          style={{
            borderLeft: "3px solid #7c6d9e",
            paddingLeft: "20px",
            margin: "1.6em 0",
            color: "rgba(240,240,240,0.55)",
            fontStyle: "italic",
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            lineHeight: 1.7,
          }}
        >
          <RenderInline tokens={block.children} />
        </blockquote>
      );
    case "code":
      return (
        <div
          style={{
            margin: "1.6em 0",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {block.lang && (
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#7c6d9e",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {block.lang}
            </div>
          )}
          <pre
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "20px",
              overflowX: "auto",
              margin: 0,
              fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
              fontSize: "13px",
              lineHeight: 1.75,
              color: "rgba(240,240,240,0.8)",
            }}
          >
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "ul":
      return (
        <ul
          style={{
            ...BASE_TEXT,
            fontSize: "clamp(13px, 1.2vw, 15px)",
            margin: "0 0 1.2em",
            paddingLeft: "0",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  marginTop: "9px",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#7c6d9e",
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1 }}>
                <RenderInline tokens={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          style={{
            ...BASE_TEXT,
            fontSize: "clamp(13px, 1.2vw, 15px)",
            margin: "0 0 1.2em",
            paddingLeft: "0",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#7c6d9e",
                  fontWeight: 700,
                  minWidth: "22px",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span style={{ flex: 1 }}>
                <RenderInline tokens={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "hr":
      return (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            margin: "2.4em 0",
          }}
        />
      );
    case "image":
      if (!isSafeSrc(block.src)) return null;
      return (
        <div style={{ margin: "2em 0" }}>
          <img
            src={block.src}
            alt={block.alt}
            style={{
              width: "100%",
              borderRadius: "12px",
              display: "block",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
          {block.alt && (
            <p
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "12px",
                color: "rgba(240,240,240,0.35)",
                textAlign: "center",
                marginTop: "10px",
                fontStyle: "italic",
              }}
            >
              {block.alt}
            </p>
          )}
        </div>
      );
    default:
      return null;
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BlogPostContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <article
      style={{
        fontFamily: "var(--font-dm-sans, sans-serif)",
      }}
    >
      {blocks.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
    </article>
  );
}
