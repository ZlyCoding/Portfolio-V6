/**
 * Converts a post title to a URL-friendly slug.
 * Handles Indonesian characters, symbols, emojis, and special chars.
 *
 * Example:
 *   "5 Kesalahan Programmer Pemula (Nomor 3 Paling Fatal!)"
 *   → "5-kesalahan-programmer-pemula-nomor-3-paling-fatal"
 */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      // Normalize unicode (handle accented chars like é → e)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace common special chars / punctuation with space
      .replace(/[^\w\s-]/g, " ")
      // Collapse whitespace & replace with hyphens
      .trim()
      .replace(/[\s_]+/g, "-")
      // Remove consecutive hyphens
      .replace(/-{2,}/g, "-")
      // Trim leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
