"use client";

export type Language = "nl" | "en";

const LANG_KEY = "fitness_language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "nl";
  return (localStorage.getItem(LANG_KEY) as Language) ?? "nl";
}

export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new CustomEvent("languagechange", { detail: lang }));
}

export type BilingualText = {
  nl: string;
  en: string;
};

export function t(text: BilingualText, lang: Language): string {
  return text[lang];
}
