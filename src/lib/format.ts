export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function capitalizeFirst(text?: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const WORDS_PER_MINUTE = 200;

export function getReadingTime(plainText?: string) {
  const wordCount = plainText?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
