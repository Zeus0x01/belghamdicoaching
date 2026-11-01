"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/three/Hero3D";
import { PALETTE_CHIPS } from "@/lib/muscle-palette";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { t } = useI18n();

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Hero3D />
        <div
          id="hero-figure"
          aria-hidden
          className="absolute right-[3%] top-1/2 -translate-y-1/2 h-[84vh] w-[34vw] lg:right-[6%] lg:w-[22vw]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pointer-events-none">
        <motion.div
          style={{ y, opacity }}
          className="max-w-2xl pointer-events-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="eyebrow mb-6"
          >
            {t("hero_kicker")}
          </motion.p>

          <h1 className="heading-xl text-[clamp(3.2rem,9vw,7.5rem)]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {t("hero_headline_1")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block text-transparent"
              style={{ WebkitTextStroke: "1px #77746E" }}
            >
              {t("hero_headline_2")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="block text-copper"
            >
              {t("hero_headline_3")}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="body-lg mt-6 max-w-md"
          >
            {t("hero_copy")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link href="/programs" className="btn-primary">
              {t("cta_explore")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/coaching" className="btn-secondary">
              {t("cta_transform")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {PALETTE_CHIPS.map((chip) => (
              <span key={chip.id} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: chip.color, boxShadow: `0 0 8px ${chip.color}88` }}
                />
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-wgray">
                  {chip.label}
                </span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-display uppercase tracking-[0.35em] text-wgray">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-copper to-transparent"
        />
      </motion.div>
    </section>
  );
}
