"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

type Dict = typeof hi;
export type Lang = "hi" | "en";
export type FontSize = "sm" | "md" | "lg";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  t: (key: string) => string;
  dict: Dict;
};

const Ctx = createContext<I18nCtx | null>(null);

function cleanFallback(path: string): string {
  // Strip "nav." or similar prefixes
  let label = path;
  if (label.startsWith("nav.")) {
    label = label.replace("nav.", "");
  }
  // Convert camelCase to words (e.g. kisanSeva -> Kisan Seva)
  const spaced = label.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function get(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return cleanFallback(path);
    }
  }
  return typeof cur === "string" ? cur : cleanFallback(path);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");

  useEffect(() => {
    // Default language is English ("en") across the portal
    const savedLang = localStorage.getItem("uks-lang-v2");
    if (savedLang === "hi") {
      setLangState("hi");
      document.documentElement.lang = "hi";
    } else {
      setLangState("en");
      document.documentElement.lang = "en";
      localStorage.setItem("uks-lang-v2", "en");
      localStorage.setItem("uks-lang", "en");
    }

    const savedFont = localStorage.getItem("uks-font-size");
    if (savedFont === "sm" || savedFont === "md" || savedFont === "lg") {
      setFontSizeState(savedFont);
      document.documentElement.setAttribute("data-font-size", savedFont);
    } else {
      document.documentElement.setAttribute("data-font-size", "md");
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("uks-lang-v2", l);
    localStorage.setItem("uks-lang", l);
    document.documentElement.lang = l;

    // Sync with Google Translate Cookie so the entire page translates seamlessly
    if (typeof document !== "undefined") {
      const hostname = window.location.hostname;
      document.cookie = `googtrans=/en/${l}; path=/;`;
      document.cookie = `googtrans=/en/${l}; path=/; domain=${hostname};`;
      
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = l;
        select.dispatchEvent(new Event("change"));
      }
    }
  }, []);

  const setFontSize = useCallback((s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem("uks-font-size", s);
    document.documentElement.setAttribute("data-font-size", s);
  }, []);

  const dict = (lang === "hi" ? hi : en) as Dict;
  const t = useCallback(
    (key: string) => get(dict as unknown as Record<string, unknown>, key),
    [dict]
  );

  const value = useMemo(
    () => ({ lang, setLang, fontSize, setFontSize, t, dict }),
    [lang, setLang, fontSize, setFontSize, t, dict]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
