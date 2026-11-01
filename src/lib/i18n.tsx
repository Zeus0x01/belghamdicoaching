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
  newsletter_placeholder: {
    en: "Email for training insights",
    ar: "بريدك الإلكتروني لنصائح التدريب",
  },
  newsletter_subscribe: { en: "Subscribe", ar: "اشترك" },
  newsletter_email_label: {
    en: "Newsletter email",
    ar: "البريد الإلكتروني للنشرة",
  },
  newsletter_success: { en: "You are on the list.", ar: "تم إضافتك إلى القائمة." },
  newsletter_error: {
    en: "Please enter a valid email address.",
    ar: "يرجى إدخال بريد إلكتروني صحيح.",
  },
  coaching_compare_title: { en: "Quick comparison", ar: "مقارنة سريعة" },
  coaching_table_feature: { en: "Feature", ar: "الميزة" },
  coaching_tier_silver: { en: "Silver", ar: "سيلفر" },
  coaching_tier_gold: { en: "Gold", ar: "جولد" },
  coaching_row_followup: {
    en: "Follow-up frequency",
    ar: "تكرار المتابعة",
  },
  coaching_row_reporting: { en: "Reporting", ar: "التقارير" },
  coaching_row_response: { en: "Response time", ar: "زمن الرد" },
  coaching_row_support: { en: "Support", ar: "الدعم" },
  home_prog_title: {
    en: "Programs engineered for outcomes.",
    ar: "برامج مصممة لتحقيق نتائج.",
  },
  home_prog_copy: {
    en: "Structured plans with clear progression — from your first week of training to advanced hypertrophy work.",
    ar: "خطط منظمة بتدرج واضح — من أسبوعك الأول في التدريب حتى تمارين التضخيم المتقدمة.",
  },
  cta_all_programs: { en: "All Programs", ar: "جميع البرامج" },
  home_coach_title: { en: "Coach in your corner. Every week.", ar: "كوتش بجوارك. كل أسبوع." },
  home_coach_copy: {
    en: "Silver and Gold coaching tracks keep your plan evolving with your progress — not fading after week six.",
    ar: "مسارات الكوتشينج سيلفر وجولد تجعل خطتك تتطور مع تقدمك — لا تفقد فعاليتها بعد الأسبوع السادس.",
  },
  home_coach_silver_freq: { en: "Bi-weekly", ar: "كل أسبوعين" },
  home_coach_silver_copy: {
    en: "Personalized training, exercise breakdowns, and a progress report every two weeks.",
    ar: "تدريب شخصي، شرح تفصيلي للتمارين، وتقرير تقدم كل أسبوعين.",
  },
  home_coach_gold_freq: { en: "Weekly", ar: "أسبوعياً" },
  home_coach_gold_copy: {
    en: "Everything in Silver plus nutrition planning, weekly deep-dive reviews, and priority responses.",
    ar: "كل ما في سيلفر بالإضافة إلى تخطيط التغذية، ومراجعات أسبوعية تفصيلية، وردود ذات أولوية.",
  },
  cta_compare_coaching: { en: "Compare Coaching", ar: "قارن الباقات" },
  home_feat_1_title: { en: "Instant PDF delivery", ar: "تسليم PDF فوري" },
  home_feat_1_copy: {
    en: "Every program includes a print-ready plan.",
    ar: "كل برنامج يتضمن خطة جاهزة للطباعة.",
  },
  home_feat_2_title: { en: "Data-driven check-ins", ar: "متابعة مبنية على البيانات" },
  home_feat_2_copy: {
    en: "Weight trends, adherence, and workload tracked.",
    ar: "متابعة مؤشرات الوزن والالتزام وحجم التدريب.",
  },
  home_feat_3_title: { en: "Direct coach access", ar: "تواصل مباشر مع الكوتش" },
  home_feat_3_copy: {
    en: "Real adjustments from real feedback.",
    ar: "تعديلات حقيقية بناءً على ملاحظات واقعية.",
  },
  home_timeline_title: { en: "Progress is a timeline, not a photo.", ar: "التقدم رحلة زمنية، لا صورة." },
  home_timeline_copy: {
    en: "Our clients' journeys follow weekly checkpoints. Explore sample demo timelines below.",
    ar: "رحلات عملائنا تمر بمحطات أسبوعية. استكشف نماذج تجريبية من الخطوط الزمنية أدناه.",
  },
  cta_explore_journeys: { en: "Explore All Journeys", ar: "استكشف كل الرحلات" },
  philosophy_eyebrow: { en: "The Philosophy", ar: "الفلسفة" },
  philosophy_title: { en: "Training is a science.", ar: "التدريب علم." },
  philosophy_title_accent: { en: "We treat it that way.", ar: "ونتعامل معه كذلك." },
  philosophy_principle_1_title: { en: "Training with purpose", ar: "تدريب بهدف واضح" },
  philosophy_principle_1_copy: {
    en: "Every session maps to a phase. Nothing is filler.",
    ar: "كل جلسة تمرين مربوطة بمرحلة محددة. لا يوجد أي حشو.",
  },
  philosophy_principle_2_title: { en: "Scientific programming", ar: "برمجة علمية" },
  philosophy_principle_2_copy: {
    en: "Volume, intensity, and progression driven by evidence.",
    ar: "الحجم والشدة والتدرج مبنية على الأدلة العلمية.",
  },
  philosophy_principle_3_title: { en: "Consistency", ar: "الاستمرارية" },
  philosophy_principle_3_copy: {
    en: "The structure you can repeat is the structure that works.",
    ar: "الخطة التي تستطيع تكرارها هي الخطة التي تنجح.",
  },
  philosophy_principle_4_title: { en: "Progressive overload", ar: "زيادة الأحمال التدريجية" },
  philosophy_principle_4_copy: {
    en: "Measured increases week by week — no guesswork.",
    ar: "زيادات محسوبة أسبوعاً بعد أسبوع — بدون تخمين.",
  },
  philosophy_principle_5_title: { en: "Sustainable development", ar: "بناء مستدام" },
  philosophy_principle_5_copy: {
    en: "Physique built for years, not for one photo.",
    ar: "بناء جسم يبقى معك لسنوات، لا لصورة واحدة.",
  },
  hiw_eyebrow: { en: "How It Works", ar: "طريقة العمل" },
  hiw_title: { en: "From zero to first check-in.", ar: "من الصفر إلى أول جلسة متابعة." },
  hiw_step_1_title: { en: "Choose your program", ar: "اختر برنامجك" },
  hiw_step_1_copy: {
    en: "Pick the program that matches your goal, experience, and schedule.",
    ar: "اختر البرنامج المناسب لهدفك وخبرتك وجدولك.",
  },
  hiw_step_2_title: { en: "Complete your purchase", ar: "أكمل عملية الشراء" },
  hiw_step_2_copy: {
    en: "Secure checkout. Instant access to your plan.",
    ar: "دفع آمن. وصول فوري إلى خطتك.",
  },
  hiw_step_3_title: { en: "Submit your personal information", ar: "أرسل بياناتك الشخصية" },
  hiw_step_3_copy: {
    en: "A short intake form so your plan fits you.",
    ar: "نموذج قصير حتى تُبنى خطتك حسب وضعك.",
  },
  hiw_step_4_title: { en: "Receive your training plan", ar: "استلم خطة التدريب" },
  hiw_step_4_copy: {
    en: "Delivered with video breakdowns of every movement.",
    ar: "تُسلَّم مع شرح بالفيديو لكل تمرين.",
  },
  hiw_step_5_title: { en: "Track your progress", ar: "تابع تقدمك" },
  hiw_step_5_copy: {
    en: "Check-ins and adjustments based on real data.",
    ar: "متابعات وتعديلات مبنية على بيانات حقيقية.",
  },
  testimonials_eyebrow: { en: "Testimonials", ar: "آراء العملاء" },
  testimonials_title: { en: "What training feels like here.", ar: "تجربة التدريب عندنا." },
  badge_demo: { en: "Demo", ar: "تجريبي" },
  cta_final_bg: { en: "NEXT LEVEL", ar: "المستوى القادم" },
  cta_final_eyebrow: { en: "Final Call", ar: "الفرصة الأخيرة" },
  cta_final_headline: { en: "YOUR NEXT LEVEL STARTS HERE.", ar: "مستواك القادم يبدأ من هنا." },
  cta_final_copy: {
    en: "The programs are ready. The coaching is personalized. The first session is yours.",
    ar: "البرامج جاهزة. الكوتشينج شخصي. الجلسة الأولى لك.",
  },
  cta_find_program: { en: "Find My Program", ar: "اعثر على برنامجك" },
  demo_content_note: {
    en: "Demo Content — replace with real client story",
    ar: "محتوى تجريبي — استبدله بقصة عميل حقيقية",
  },
  timeline_weeks_journey: {
    en: "{weeks}-week journey",
    ar: "رحلة مدتها {weeks} أسبوعاً",
  },
  timeline_week_label: { en: "Week {week}", ar: "الأسبوع {week}" },
  timeline_collapse: { en: "Collapse", ar: "إخفاء" },
  timeline_expand: { en: "Expand", ar: "إظهار" },
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
