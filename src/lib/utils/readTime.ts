/**
 * Estimasi waktu baca artikel.
 *
 * Referensi: rata-rata orang membaca ~238 wpm (Brysbaert et al., 2019).
 * Tambahan 12 detik per gambar (media pause time).
 */

const WORDS_PER_MINUTE = 238;
const SECONDS_PER_IMAGE = 12;

/**
 * Strip karakter non-kata dari teks markdown / HTML sebelum dihitung.
 * Menghapus: heading markers, bold/italic, code blocks, URLs, HTML tags.
 */
function stripMarkdown(text: string): string {
  return (
    text
      // Fenced code blocks (``` ... ```)
      .replace(/```[\s\S]*?```/g, " ")
      // Inline code
      .replace(/`[^`]*`/g, " ")
      // HTML tags
      .replace(/<[^>]+>/g, " ")
      // Images ![alt](url) — counted separately
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, " ")
      // Links [text](url) → text saja
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Heading markers
      .replace(/^#{1,6}\s+/gm, "")
      // Bold / italic markers
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
      // Blockquote markers
      .replace(/^>\s+/gm, "")
      // Horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")
      // Trailing spaces & multiple whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Hitung jumlah gambar markdown di dalam konten. */
function countImages(text: string): number {
  return (text.match(/!\[[^\]]*\]\([^)]*\)/g) ?? []).length;
}

/**
 * Estimasi waktu baca dari teks penuh (markdown / HTML / plain).
 *
 * @param content   Teks artikel lengkap.
 * @returns         Jumlah menit (minimum 1).
 */
export function estimateReadTime(content: string | null | undefined): number {
  if (!content?.trim()) return 1;

  const clean = stripMarkdown(content);
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const imageCount = countImages(content);

  const readingSeconds = (wordCount / WORDS_PER_MINUTE) * 60;
  const imageSeconds = imageCount * SECONDS_PER_IMAGE;
  const totalMinutes = (readingSeconds + imageSeconds) / 60;

  return Math.max(1, Math.round(totalMinutes));
}

/**
 * Estimasi kasar dari excerpt saja (dipakai di BlogCard ketika
 * full content tidak di-fetch). Hasilnya sengaja sedikit lebih besar
 * karena excerpt biasanya ~10–20% dari panjang artikel.
 *
 * Rumus: word_count_excerpt / 0.15 ≈ estimasi word count artikel penuh,
 * lalu dibagi WPM. Cap minimum 2 menit supaya tidak terlalu under-estimate.
 */
export function estimateReadTimeFromExcerpt(
  excerpt: string | null | undefined,
): number {
  if (!excerpt?.trim()) return 3;

  const wordCount = excerpt.trim().split(/\s+/).filter(Boolean).length;
  // Excerpt rata-rata ~15% dari total artikel
  const estimatedTotal = wordCount / 0.15;
  const minutes = estimatedTotal / WORDS_PER_MINUTE;

  return Math.max(2, Math.round(minutes));
}
