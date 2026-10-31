"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const DICT: Record<string, { en: string; ar: string }> = {
  nav_programs: { en: "Programs", ar: "البرامج" },
  nav_coaching: { en: "Online Coaching", ar: "الكوتشينج أونلاين" },
  nav_transformations: { en: "Transformations", ar: "التحولات" },
  nav_about: { en: "About", ar: "عن المدرب" },
  nav_contact: { en: "Contact", ar: "اتصل بنا" },
  nav_cart: { en: "Cart", ar: "السلة" },
  nav_login: { en: "Client Login", ar: "دخول العملاء" },
  hero_kicker: { en: "Anatomy of Performance", ar: "تشريح الأداء" },
  hero_headline_1: { en: "BUILD", ar: "ابنِ" },
  hero_headline_2: { en: "BEYOND", ar: "ما وراء" },
  hero_headline_3: { en: "YOUR LIMITS.", ar: "حدودك." },
  hero_copy: {
    en: "Science-backed training. Personalized coaching. Measurable progress.",
    ar: "تدريب علمي. كوتشينج شخصي. نتائج قابلة للقياس.",
  },
  cta_explore: { en: "Explore Programs", ar: "استكشف البرامج" },
  cta_transform: { en: "Start Your Transformation", ar: "ابدأ تحولك" },
  cta_add_cart: { en: "Add to Cart", ar: "أضف إلى السلة" },
  cta_view_details: { en: "View Details", ar: "عرض التفاصيل" },
  section_programs: { en: "Training Programs", ar: "برامج التدريب" },
  section_coaching: { en: "Online Coaching", ar: "الكوتشينج أونلاين" },
  section_transformations: { en: "Transformations", ar: "التحولات" },
  footer_tagline: {
    en: "Performance coaching built on science.",
    ar: "كوتشينج أداء مبني على العلم.",
  },
};

type I18nCtx = { lang: Lang; t: (k: keyof typeof DICT) => string; setLang: (l: Lang) => void };

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("bc_lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("bc_lang", l);
  };

  const t = (k: keyof typeof DICT) => {
    const entry = DICT[k];
    if (!entry) return String(k);
    return lang === "ar" ? entry.ar : entry.en;
  };

  return <Ctx.Provider value={{ lang, t, setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
