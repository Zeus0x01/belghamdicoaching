"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="heading-xl text-4xl md:text-5xl lg:text-6xl max-w-3xl">
        {title}
      </h2>
      {copy && <p className={`body-lg mt-5 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{copy}</p>}
    </Reveal>
  );
}
