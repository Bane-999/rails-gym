/**
 * Strips ANSI escape codes from terminal output
 * @param text - Raw text with ANSI codes
 * @returns Cleaned text without ANSI codes
 */
export const stripAnsiCodes = (text: string): string => {
  if (!text) return text;

  // Remove ANSI escape codes (e.g., [0;32m, [0m, etc.)
  return text.replace(/\x1b\[[0-9;]*m/g, '');
};
