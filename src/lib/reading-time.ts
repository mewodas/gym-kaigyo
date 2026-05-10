export function calculateReadingTime(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_`>\[\]\(\)\-|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const charsPerMinute = 600;
  return Math.max(1, Math.ceil(stripped.length / charsPerMinute));
}
