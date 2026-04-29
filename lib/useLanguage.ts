"use client";

import { useState, useEffect } from "react";
import { getLanguage, setLanguage, type Language } from "./language";

export function useLanguage() {
  const [lang, setLang] = useState<Language>("nl");

  useEffect(() => {
    setLang(getLanguage());
    function handleChange(e: Event) {
      setLang((e as CustomEvent<Language>).detail);
    }
    window.addEventListener("languagechange", handleChange);
    return () => window.removeEventListener("languagechange", handleChange);
  }, []);

  function toggleLanguage() {
    const next: Language = lang === "nl" ? "en" : "nl";
    setLanguage(next);
    setLang(next);
  }

  function changeLanguage(l: Language) {
    setLanguage(l);
    setLang(l);
  }

  return { lang, toggleLanguage, changeLanguage };
}
