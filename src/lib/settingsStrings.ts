import type { Lang } from "@/lib/i18n";

const en = {
  title: "Settings",
  legal: "Legal & support",
  close: "Close",
};

type SettingsStrings = typeof en;

const fr: SettingsStrings = {
  title: "Paramètres",
  legal: "Mentions légales et assistance",
  close: "Fermer",
};

const es: SettingsStrings = {
  title: "Ajustes",
  legal: "Legal y ayuda",
  close: "Cerrar",
};

const pt: SettingsStrings = {
  title: "Configurações",
  legal: "Jurídico e suporte",
  close: "Fechar",
};

const sw: SettingsStrings = {
  title: "Mipangilio",
  legal: "Sheria na msaada",
  close: "Funga",
};

const zh: SettingsStrings = {
  title: "设置",
  legal: "法律与支持",
  close: "关闭",
};

export const SETTINGS_STRINGS: Record<Lang, SettingsStrings> = { en, fr, es, pt, sw, zh };
