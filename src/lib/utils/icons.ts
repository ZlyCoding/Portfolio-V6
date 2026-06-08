/**
 * icons.ts
 * Semua icon mapping: platform socials, contact, dan skills.
 * Menggunakan react-icons — no dangerouslySetInnerHTML.
 */

import type { IconType } from "react-icons";

// ── Social / Platform Icons ────────────────────────────────────────────────────
import {
  SiGithub,
  SiInstagram,
  SiX,
  SiYoutube,
  SiTiktok,
  SiDribbble,
  SiBehance,
  SiDiscord,
  SiTelegram,
  SiWhatsapp,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdLanguage,
  MdCode,
  MdBrush,
} from "react-icons/md";

// ── Skill Icons ────────────────────────────────────────────────────────────────
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiSupabase,
  SiPostgresql,
  SiFigma,
  SiBlender,
  SiGit,
  SiVercel,
  SiDocker,
  SiPython,
  SiFramer,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiRemix,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiPrisma,
  SiGraphql,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiLaravel,
  SiPhp,
  SiRust,
  SiGo,
  SiSwift,
  SiKotlin,
  SiFlutter,
  SiDart,
  SiSketch,
  SiNotion,
  SiLinux,
  SiNginx,
  SiKubernetes,
  SiGooglecloud,
  SiNuxt,
  SiSass,
  SiWebpack,
  SiVite,
  SiJest,
  SiCplusplus,
  SiC,
  SiRuby,
  SiRubyonrails,
} from "react-icons/si";
import { FaAmazon, FaWordpress, FaShopify } from "react-icons/fa";
import {
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobeXd,
  TbBrandAzure,
} from "react-icons/tb";

// ── Platform Icons ──────────────────────────────────────────────────────────────

export interface PlatformIcon {
  label: string;
  Icon: IconType;
  detect: (url: string) => boolean;
}

export const PLATFORM_ICONS: Record<string, PlatformIcon> = {
  github: {
    label: "GitHub",
    Icon: SiGithub,
    detect: (u) => /github\.com/i.test(u),
  },
  linkedin: {
    label: "LinkedIn",
    Icon: FaLinkedin,
    detect: (u) => /linkedin\.com/i.test(u),
  },
  instagram: {
    label: "Instagram",
    Icon: SiInstagram,
    detect: (u) => /instagram\.com/i.test(u),
  },
  twitter: {
    label: "X / Twitter",
    Icon: SiX,
    detect: (u) => /twitter\.com|x\.com/i.test(u),
  },
  youtube: {
    label: "YouTube",
    Icon: SiYoutube,
    detect: (u) => /youtube\.com|youtu\.be/i.test(u),
  },
  tiktok: {
    label: "TikTok",
    Icon: SiTiktok,
    detect: (u) => /tiktok\.com/i.test(u),
  },
  dribbble: {
    label: "Dribbble",
    Icon: SiDribbble,
    detect: (u) => /dribbble\.com/i.test(u),
  },
  behance: {
    label: "Behance",
    Icon: SiBehance,
    detect: (u) => /behance\.net/i.test(u),
  },
  discord: {
    label: "Discord",
    Icon: SiDiscord,
    detect: (u) => /discord\.(gg|com)/i.test(u),
  },
  telegram: {
    label: "Telegram",
    Icon: SiTelegram,
    detect: (u) => /t\.me|telegram\.(me|org)/i.test(u),
  },
  whatsapp: {
    label: "WhatsApp",
    Icon: SiWhatsapp,
    detect: (u) => /wa\.me|whatsapp\.com/i.test(u),
  },
  website: { label: "Website", Icon: MdLanguage, detect: () => false },
};

export function detectPlatform(url: string): string {
  for (const [key, config] of Object.entries(PLATFORM_ICONS)) {
    if (key === "website") continue;
    if (config.detect(url)) return key;
  }
  return "website";
}

export function parseSocials(socials: string[] | null | undefined) {
  if (!socials?.length) return [];
  return socials.filter(Boolean).map((url) => {
    const platform = detectPlatform(url);
    const config = PLATFORM_ICONS[platform];
    return { platform, label: config.label, url, Icon: config.Icon };
  });
}

// ── Contact Icons ──────────────────────────────────────────────────────────────

export interface ContactIcon {
  Icon: IconType;
  hrefPrefix: (value: string) => string;
}

export const CONTACT_ICONS: Record<string, ContactIcon> = {
  email: {
    Icon: MdEmail,
    hrefPrefix: (v) => (v.startsWith("mailto:") ? v : `mailto:${v}`),
  },
  phone: {
    Icon: MdPhone,
    hrefPrefix: (v) => (v.startsWith("tel:") ? v : `tel:${v}`),
  },
  whatsapp: {
    Icon: SiWhatsapp,
    hrefPrefix: (v) => {
      if (v.startsWith("https://wa.me") || v.startsWith("https://whatsapp"))
        return v;
      return `https://wa.me/${v.replace(/\D/g, "")}`;
    },
  },
  telegram: {
    Icon: SiTelegram,
    hrefPrefix: (v) =>
      v.startsWith("http") ? v : `https://t.me/${v.replace("@", "")}`,
  },
  location: {
    Icon: MdLocationOn,
    hrefPrefix: (v) => `https://maps.google.com/?q=${encodeURIComponent(v)}`,
  },
  website: {
    Icon: MdLanguage,
    hrefPrefix: (v) => (v.startsWith("http") ? v : `https://${v}`),
  },
};

function detectContactIcon(value: string): ContactIcon {
  const v = value.toLowerCase();
  if (/wa\.me|whatsapp\.com/.test(v)) return CONTACT_ICONS.whatsapp;
  if (/t\.me|telegram\.(me|org)/.test(v)) return CONTACT_ICONS.telegram;
  if (v.includes("@") && !v.includes("/")) return CONTACT_ICONS.email;
  if (/^[\+0-9][\d\s\-()]+$/.test(v.trim())) return CONTACT_ICONS.phone;
  if (/maps\.google|goo\.gl\/maps/.test(v)) return CONTACT_ICONS.location;
  return CONTACT_ICONS.website;
}

export function parseContacts(contact: string[] | null | undefined) {
  if (!contact?.length) return [];
  return contact.filter(Boolean).map((value) => {
    const icon = detectContactIcon(value);
    return {
      label: value,
      value,
      href: icon.hrefPrefix(value),
      Icon: icon.Icon,
    };
  });
}

// ── Skill Icons ──────────────────────────────────────────────────────────────

export const SKILL_ICON_MAP: Record<string, IconType> = {
  // Frontend
  react: SiReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  vue: SiVuedotjs,
  "vue.js": SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,
  nuxt: SiNuxt,
  "nuxt.js": SiNuxt,
  remix: SiRemix,
  framer: SiFramer,
  "framer motion": SiFramer,
  sass: SiSass,
  scss: SiSass,
  webpack: SiWebpack,
  vite: SiVite,
  // Backend
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  python: SiPython,
  express: SiExpress,
  "express.js": SiExpress,
  fastapi: SiFastapi,
  django: SiDjango,
  laravel: SiLaravel,
  php: SiPhp,
  rust: SiRust,
  go: SiGo,
  golang: SiGo,
  ruby: SiRuby,
  rails: SiRubyonrails,
  "ruby on rails": SiRubyonrails,
  graphql: SiGraphql,
  prisma: SiPrisma,
  // Database
  supabase: SiSupabase,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  mysql: SiMysql,
  redis: SiRedis,
  firebase: SiFirebase,
  // Mobile
  flutter: SiFlutter,
  dart: SiDart,
  swift: SiSwift,
  kotlin: SiKotlin,
  // Design
  figma: SiFigma,
  photoshop: TbBrandAdobePhotoshop,
  "adobe photoshop": TbBrandAdobePhotoshop,
  illustrator: TbBrandAdobeIllustrator,
  "adobe illustrator": TbBrandAdobeIllustrator,
  blender: SiBlender,
  "adobe xd": TbBrandAdobeXd,
  xd: TbBrandAdobeXd,
  sketch: SiSketch,
  design: MdBrush,
  // Tools & DevOps
  git: SiGit,
  github: SiGithub,
  vercel: SiVercel,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
  aws: FaAmazon,
  "amazon aws": FaAmazon,
  gcp: SiGooglecloud,
  "google cloud": SiGooglecloud,
  azure: TbBrandAzure,
  linux: SiLinux,
  nginx: SiNginx,
  jest: SiJest,
  notion: SiNotion,
  wordpress: FaWordpress,
  shopify: FaShopify,
  // Languages
  "c++": SiCplusplus,
  cpp: SiCplusplus,
  c: SiC,
};

/**
 * Cari icon berdasarkan nama skill (case-insensitive).
 * Fallback ke MdCode jika tidak ditemukan.
 */
export function getSkillIcon(name: string): IconType {
  const key = name.trim().toLowerCase();
  return SKILL_ICON_MAP[key] ?? MdCode;
}

/**
 * Deteksi kategori skill dari nama (untuk tab filter).
 */
export function detectSkillCategory(
  name: string,
): "frontend" | "backend" | "design" | "tools" | "other" {
  const k = name.trim().toLowerCase();
  const frontend = [
    "react",
    "next.js",
    "nextjs",
    "typescript",
    "ts",
    "javascript",
    "js",
    "tailwind",
    "tailwindcss",
    "vue",
    "vue.js",
    "svelte",
    "angular",
    "nuxt",
    "nuxt.js",
    "remix",
    "framer",
    "framer motion",
    "sass",
    "scss",
    "webpack",
    "vite",
  ];
  const backend = [
    "node.js",
    "nodejs",
    "node",
    "python",
    "express",
    "express.js",
    "fastapi",
    "django",
    "laravel",
    "php",
    "rust",
    "go",
    "golang",
    "ruby",
    "rails",
    "ruby on rails",
    "graphql",
    "prisma",
    "supabase",
    "postgresql",
    "postgres",
    "mongodb",
    "mysql",
    "redis",
    "firebase",
    "flutter",
    "dart",
    "swift",
    "kotlin",
    "c++",
    "cpp",
    "c",
  ];
  const design = [
    "figma",
    "photoshop",
    "adobe photoshop",
    "illustrator",
    "adobe illustrator",
    "blender",
    "adobe xd",
    "xd",
    "sketch",
    "design",
  ];
  const tools = [
    "git",
    "github",
    "vercel",
    "docker",
    "kubernetes",
    "k8s",
    "aws",
    "amazon aws",
    "gcp",
    "google cloud",
    "azure",
    "linux",
    "nginx",
    "jest",
    "notion",
    "wordpress",
    "shopify",
  ];
  if (frontend.includes(k)) return "frontend";
  if (backend.includes(k)) return "backend";
  if (design.includes(k)) return "design";
  if (tools.includes(k)) return "tools";
  return "other";
}
