import type { PortableTextBlock } from "@portabletext/types";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthYear(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatRange(start?: string, end?: string, isCurrent?: boolean) {
  const startLabel = formatMonthYear(start);
  const endLabel = isCurrent ? "Present" : formatMonthYear(end);

  if (startLabel && endLabel && startLabel === endLabel) return startLabel;
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || "";
}

// Canonical labels so "full time", "full-time" and "Full-Time" all render the same.
const TAG_LABELS: Record<string, string> = {
  "full time": "Full-time",
  "part time": "Part-time",
  "self employed": "Self-employed",
  freelance: "Freelance",
  contract: "Contract",
};

export function normaliseTag(tag?: string) {
  if (!tag) return "";
  const cleaned = tag.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return TAG_LABELS[cleaned.toLowerCase()] || cleaned;
}

/**
 * Turns CMS link values into usable hrefs.
 * "mybuffbuddy.app" or "legocia.com/glimber" become https:// URLs instead of
 * resolving as relative paths on yuriguernsey.com.
 */
export function normaliseHref(href?: string) {
  const value = href?.trim();
  if (!value) return "";
  if (/^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(value)) return value;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(value)) return `https://${value}`;
  return value;
}

export function isExternalHref(href?: string) {
  return /^https?:\/\//i.test(href || "") && !/^https?:\/\/(www\.)?yuriguernsey\.com/i.test(href || "");
}

export function toPlainText(blocks?: PortableTextBlock[]) {
  if (!blocks?.length) return "";

  return blocks
    .filter((block) => block?._type === "block" && Array.isArray(block.children))
    .map((block) =>
      block.children
        .filter((child) => "text" in child)
        .map((child) => child.text)
        .join("")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
