"use client";

import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

const FAQS = [
  {
    q: "What is the difference between the training programs and online coaching?",
    a: "Online coaching is the full service: a training AND nutrition plan built specifically for you, with continuous follow-up. The training programs are ready-to-execute plans you start immediately — no nutrition plan or follow-up — reaching your goal at the lowest cost.",
  },
  {
    q: "Are the programs or coaching suitable for me if I'm a beginner?",
    a: "Absolutely — the entire service respects your level, beginner or advanced. You get full instructions for everything in your program plus detailed video explanations of every exercise so you train with the best efficiency and safety.",
  },
  {
    q: "My time is tight and I can't train often?",
    a: "You decide the number of training days that suits your life. Programs range from 3 days up to 6 days a week depending on what fits your schedule.",
  },
  {
    q: "Do these systems require an expensive gym?",
    a: "No. You can run the programs anywhere in the world, whatever the setup — every exercise in your plan has substitutes, and nutrition is built around what's available to you and your budget.",
  },
  {
    q: "How do I pick the right split for me?",
    a: "First ask: how many days can I commit 100% for the next 6 months? 3 days → Full Body. 4 days → Upper Lower. 5 days → PPL x Upper Lower. Then ask which split you actually enjoy.",
  },
  {
    q: "How does payment and activation work?",
    a: "Choose your program on the website and pay with any accepted method — Vodafone Cash, Instapay, or Visa. Then send the payment screenshot with your chosen program to WhatsApp to get activated immediately.",
  },
  {
    q: "Why is this different from anything else out there?",
    a: "Everything is designed on scientific principles — no random experimentation or wasted time. It's a clear system that has worked for thousands of clients, and it will work for you whatever your goal is.",
  },
];

export default function FaqPage() {
  return (
    <div className="pt-32 pb-28">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <p className="eyebrow mb-4">FAQ</p>
          <h1 className="heading-xl text-4xl md:text-6xl">Frequently asked questions.</h1>
        </Reveal>
        <div className="mt-14 space-y-4">
          {FAQS.map((f) => (
            <Reveal key={f.q}>
              <details className="card-surface p-6 group">
                <summary className="font-display font-semibold text-bone cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-copper text-xl shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-wgray mt-4 leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <div id="policies" className="mt-20">
          <Reveal>
            <h2 className="heading-lg text-2xl mb-6">Policies</h2>
            <div className="space-y-4 text-sm text-wgray leading-relaxed">
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">Refunds</span>
                Digital products are refundable within 14 days if the program files have not been accessed beyond the first week.
              </p>
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">Terms</span>
                Programs are licensed for personal use only. Redistribution of program files is not permitted.
              </p>
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">Privacy</span>
                Client intake data and progress records are stored securely and used solely for coaching purposes.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-wgray text-sm">Still have questions?</p>
          <Link href="/contact" className="btn-secondary mt-5 inline-flex">
            Contact the Coach
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
