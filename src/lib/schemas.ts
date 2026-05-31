import { z } from "zod";

// ── Helpers ────────────────────────────────────────────────────────────────────

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? "" : v))
  .pipe(z.union([z.literal(""), z.url("URL tidak valid")]))
  .optional()
  .default("");

const nullableUrl = z
  .string()
  .trim()
  .nullable()
  .refine((v) => v === null || v === "" || z.url().safeParse(v).success, {
    message: "URL tidak valid",
  });

// ── Projects ───────────────────────────────────────────────────────────────────

export const ProjectDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title wajib diisi.")
    .max(120, "Title maks 120 karakter."),
  description: z.string().trim().max(1000, "Deskripsi maks 1000 karakter."),
  type: z.string().trim().max(60, "Tipe maks 60 karakter."),
  live_url: optionalUrl,
  github_url: optionalUrl,
  featured: z.boolean(),
  image_url: nullableUrl,
  image_path: z.string().trim().nullable(),
});

export type ProjectDraftInput = z.input<typeof ProjectDraftSchema>;
export type ProjectDraft = z.output<typeof ProjectDraftSchema>;

export const ProjectIdSchema = z.object({
  id: z.string().uuid("ID project tidak valid."),
});

export const ProjectTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama tipe wajib diisi.")
    .max(60, "Nama tipe maks 60 karakter."),
});

export const ToggleStatusSchema = z.object({
  id: z.string().uuid("ID tidak valid."),
  currentStatus: z.enum(["published", "archived"]),
});

// ── Blog ───────────────────────────────────────────────────────────────────────

export const BlogDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title wajib diisi.")
    .max(160, "Title maks 160 karakter."),
  excerpt: z.string().trim().max(300, "Excerpt maks 300 karakter."),
  content: z.string().trim().min(1, "Konten wajib diisi."),
  featured: z.boolean(),
  image_url: nullableUrl,
  image_path: z.string().trim().nullable(),
});

export type BlogDraftInput = z.input<typeof BlogDraftSchema>;
export type BlogDraft = z.output<typeof BlogDraftSchema>;

export const PostIdSchema = z.object({
  id: z.string().uuid("ID post tidak valid."),
});

// ── About / Profile ────────────────────────────────────────────────────────────

export const NameSectionSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(80, "Nama maks 80 karakter."),
});

export const HeroSectionSchema = z.object({
  role: z.string().trim().max(100, "Role maks 100 karakter."),
  tags: z
    .array(z.string().trim().max(40, "Tag maks 40 karakter."))
    .max(10, "Maks 10 tag."),
  quote: z.string().trim().max(300, "Quote maks 300 karakter."),
  hero_url: nullableUrl,
});

export const AboutSectionSchema = z.object({
  bio: z.string().trim().max(2000, "Bio maks 2000 karakter."),
  avatar_url: nullableUrl,
});

export const SkillsSchema = z.object({
  skills: z
    .array(z.string().trim().min(1).max(60, "Skill maks 60 karakter."))
    .max(50, "Maks 50 skill."),
});

export const SocialsSchema = z.object({
  // Format: "platform|url"
  socials: z
    .array(
      z
        .string()
        .trim()
        .regex(/^.+\|.+$/, "Format social tidak valid (platform|url)."),
    )
    .max(20, "Maks 20 social link."),
});

export const ContactSchema = z.object({
  // Format: "label|value"
  contact: z
    .array(
      z
        .string()
        .trim()
        .regex(/^.+\|.+$/, "Format kontak tidak valid (label|value)."),
    )
    .max(20, "Maks 20 item kontak."),
});

// ── Upload Image ───────────────────────────────────────────────────────────────

export const UploadImageSchema = z.object({
  bucket: z
    .string()
    .trim()
    .min(1, "Bucket wajib diisi.")
    .regex(/^[a-z0-9-]+$/, "Nama bucket tidak valid."),
});

// ── Shared ─────────────────────────────────────────────────────────────────────

/** Format pesan error Zod menjadi string singkat (ambil issue pertama). */
export function formatZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Data tidak valid.";
}
