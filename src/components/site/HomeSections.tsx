"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, ClipboardList, Send, BookOpen, TrendingUp, ArrowRight, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useAdminStore } from "@/lib/demo/admin-store";
import { useI18n } from "@/lib/i18n";

const PRINCIPLES = [
  { key: "philosophy_principle_1_title", copyKey: "philosophy_principle_1_copy" },
  { key: "philosophy_principle_2_title", copyKey: "philosophy_principle_2_copy" },
  { key: "philosophy_principle_3_title", copyKey: "philosophy_principle_3_copy" },
  { key: "philosophy_principle_4_title", copyKey: "philosophy_principle_4_copy" },
  { key: "philosophy_principle_5_title", copyKey: "philosophy_principle_5_copy" },
];

export function Philosophy() {
  const { t } = useI18n();
  return (
    <section className="py-28 lg:py-36 relative noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">{t("philosophy_eyebrow")}</p>
          <h2 className="heading-xl text-4xl md:text-6xl max-w-4xl">
            {t("philosophy_title")}{" "}
            <span className="font-serif italic font-normal text-copper">
              {t("philosophy_title_accent")}
            </span>
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-wgray-dim/40">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-graphite p-10"
            >
              <span className="font-serif text-4xl text-wgray-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-semibold text-xl mt-6 text-bone">{t(p.key)}</h3>
              <p className="text-sm text-wgray mt-3 leading-relaxed">{t(p.copyKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Dumbbell, key: "hiw_step_1_title", copyKey: "hiw_step_1_copy" },
  { icon: ClipboardList, key: "hiw_step_2_title", copyKey: "hiw_step_2_copy" },
  { icon: Send, key: "hiw_step_3_title", copyKey: "hiw_step_3_copy" },
  { icon: BookOpen, key: "hiw_step_4_title", copyKey: "hiw_step_4_copy" },
  { icon: TrendingUp, key: "hiw_step_5_title", copyKey: "hiw_step_5_copy" },
];

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">{t("hiw_eyebrow")}</p>
          <h2 className="heading-xl text-4xl md:text-5xl">{t("hiw_title")}</h2>
        </Reveal>
        <div className="mt-16 flex flex-col lg:flex-row gap-0 lg:gap-0">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex-1 border border-wgray-dim/50 p-8 lg:border-l-0 first:lg:border-l bg-obsidian"
            >
              <span className="absolute top-6 right-6 font-serif text-3xl text-wgray-dim/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <s.icon className="h-6 w-6 text-copper" />
              <h3 className="font-display font-semibold text-lg mt-5 text-bone">{t(s.key)}</h3>
              <p className="text-sm text-wgray mt-2 leading-relaxed">{t(s.copyKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useI18n();
  const testimonials = useAdminStore((s) => s.testimonials).filter((tst) => tst.visible);
  return (
    <section className="py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">{t("testimonials_eyebrow")}</p>
          <h2 className="heading-xl text-4xl md:text-5xl">{t("testimonials_title")}</h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((tst, i) => (
            <motion.blockquote
              key={tst.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface p-8 relative"
            >
              {tst.demo && (
                <span className="absolute top-6 right-6 text-[10px] font-display uppercase tracking-widest text-wgray-dim border border-wgray-dim/60 px-2 py-1">
                  {t("badge_demo")}
                </span>
              )}
              <Quote className="h-6 w-6 text-copper" />
              <p className="text-bone leading-relaxed mt-5">{tst.quote}</p>
              <footer className="mt-6">
                <p className="font-display font-semibold text-sm text-bone">{tst.clientName}</p>
                <p className="text-xs text-wgray mt-1 uppercase tracking-widest">{tst.program}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { t } = useI18n();
  return (
    <section className="relative py-32 lg:py-44 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display font-bold tracking-tightest opacity-[0.05] text-[clamp(4rem,14vw,12rem)] whitespace-nowrap select-none"
      >
        {t("cta_final_bg")}
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <p className="eyebrow mb-5">{t("cta_final_eyebrow")}</p>
          <h2 className="heading-xl text-5xl md:text-7xl">{t("cta_final_headline")}</h2>
          <p className="body-lg mt-6 max-w-xl mx-auto">{t("cta_final_copy")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/coaching" className="btn-primary">
              {t("cta_transform")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/selector" className="btn-secondary">
              {t("cta_find_program")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
