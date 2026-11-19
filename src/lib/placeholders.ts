import type { Lang } from "./i18n";

// Finds unfinished template text such as "[date]" or "[amount]" left in a field.
// Only short bracketed phrases count, so ordinary sentences are not flagged.
const PATTERN = /\[[^[\]\n]{1,40}\]/g;

export function findPlaceholders(texts: (string | null | undefined)[]): string[] {
  const found = new Set<string>();
  for (const text of texts) {
    if (!text) continue;
    for (const match of Array.from(text.matchAll(PATTERN))) found.add(match[0]);
  }
  return Array.from(found);
}

// Collects every text value inside an object, so the whole report can be checked at once.
export function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

const MESSAGES: Record<Lang, string> = {
  en: "Finish these before saving or exporting: {items}",
  fr: "Terminez ces champs avant d'enregistrer ou d'exporter : {items}",
  es: "Termine estos campos antes de guardar o exportar: {items}",
  pt: "Conclua estes campos antes de salvar ou exportar: {items}",
  sw: "Kamilisha haya kabla ya kuhifadhi au kuhamisha: {items}",
  zh: "保存或导出前请先完成：{items}",
};

export function placeholderMessage(lang: Lang, found: string[]): string {
  return MESSAGES[lang].replace("{items}", found.join(", "));
}
