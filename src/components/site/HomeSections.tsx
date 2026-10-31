"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, ClipboardList, Send, BookOpen, TrendingUp, ArrowRight, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useAdminStore } from "@/lib/demo/admin-store";

const PRINCIPLES = [
  { title: "Training with purpose", copy: "Every session maps to a phase. Nothing is filler." },
  { title: "Scientific programming", copy: "Volume, intensity, and progression driven by evidence." },
  { title: "Consistency", copy: "The structure you can repeat is the structure that works." },
  { title: "Progressive overload", copy: "Measured increases week by week — no guesswork." },
  { title: "Sustainable development", copy: "Physique built for years, not for one photo." },
];

export function Philosophy() {
  return (
    <section className="py-28 lg:py-36 relative noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">The Philosophy</p>
          <h2 className="heading-xl text-4xl md:text-6xl max-w-4xl">
            Training is a science.{" "}
            <span className="font-serif italic font-normal text-copper">We treat it that way.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-wgray-dim/40">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-graphite p-10"
            >
              <span className="font-serif text-4xl text-wgray-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-semibold text-xl mt-6 text-bone">{p.title}</h3>
              <p className="text-sm text-wgray mt-3 leading-relaxed">{p.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Dumbbell, title: "Choose your program", copy: "Pick the program that matches your goal, experience, and schedule." },
  { icon: ClipboardList, title: "Complete your purchase", copy: "Secure checkout. Instant access to your plan." },
  { icon: Send, title: "Submit your personal information", copy: "A short intake form so your plan fits you." },
  { icon: BookOpen, title: "Receive your training plan", copy: "Delivered with video breakdowns of every movement." },
  { icon: TrendingUp, title: "Track your progress", copy: "Check-ins and adjustments based on real data." },
];

export function HowItWorks() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">How It Works</p>
          <h2 className="heading-xl text-4xl md:text-5xl">From zero to first check-in.</h2>
        </Reveal>
        <div className="mt-16 flex flex-col lg:flex-row gap-0 lg:gap-0">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
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
              <h3 className="font-display font-semibold text-lg mt-5 text-bone">{s.title}</h3>
              <p className="text-sm text-wgray mt-2 leading-relaxed">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const testimonials = useAdminStore((s) => s.testimonials).filter((t) => t.visible);
  return (
    <section className="py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">Testimonials</p>
          <h2 className="heading-xl text-4xl md:text-5xl">What training feels like here.</h2>
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
                  Demo
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
  return (
    <section className="relative py-32 lg:py-44 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display font-bold tracking-tightest opacity-[0.05] text-[clamp(4rem,14vw,12rem)] whitespace-nowrap select-none"
      >
        NEXT LEVEL
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <p className="eyebrow mb-5">Final Call</p>
          <h2 className="heading-xl text-5xl md:text-7xl">YOUR NEXT LEVEL STARTS HERE.</h2>
          <p className="body-lg mt-6 max-w-xl mx-auto">
            The programs are ready. The coaching is personalized. The first session is yours.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/coaching" className="btn-primary">
              Start Your Transformation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/selector" className="btn-secondary">
              Find My Program
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
