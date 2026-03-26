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

  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  return startLabel || endLabel || "";
}

export function normaliseTag(tag?: string) {
  if (!tag) return "";
  return tag.replace(/-/g, " ");
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
