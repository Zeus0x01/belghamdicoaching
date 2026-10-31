"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import {
  SELECTOR_QUESTIONS,
  recommendPrograms,
  type SelectorAnswers,
} from "@/lib/selector-rules";
import type { Product } from "@/lib/catalog";

export default function SelectorPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SelectorAnswers>>({});
  const [results, setResults] = useState<Product[] | null>(null);

  const total = SELECTOR_QUESTIONS.length;
  const current = SELECTOR_QUESTIONS[step];

  const choose = (questionId: string, value: string) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setResults(
        recommendPrograms({
          goal: next.goal as SelectorAnswers["goal"],
          experience: next.experience as SelectorAnswers["experience"],
          days: Number(next.days),
          location: next.location as SelectorAnswers["location"],
          support: next.support as SelectorAnswers["support"],
        })
      );
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setResults(null);
  };

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-4">Program Selector</p>
        <h1 className="heading-xl text-4xl md:text-6xl">
          Five questions. Your next program.
        </h1>

        {results === null ? (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-10">
              {SELECTOR_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 transition-colors duration-300 ${
                    i <= step ? "bg-copper" : "bg-wgray-dim/50"
                  }`}
                />
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-display uppercase tracking-[0.3em] text-wgray mb-3">
                Question {step + 1} of {total}
              </p>
              <h2 className="heading-lg text-3xl mb-8">{current.question}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => choose(current.id, opt.value)}
                    className="text-left card-surface p-6 hover:border-copper transition-colors group"
                  >
                    <span className="font-display font-medium text-bone group-hover:text-copper transition-colors">
                      {opt.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-wgray-dim group-hover:text-copper mt-2 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-10 inline-flex items-center gap-2 text-sm text-wgray hover:text-bone transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
          </div>
        ) : (
          <div className="mt-16">
            <h2 className="heading-lg text-3xl mb-4">Your recommended programs</h2>
            <p className="text-wgray text-sm max-w-xl mb-10">
              These recommendations are informational and based on standard training principles.
              Final training decisions should be reviewed with the coach.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-12">
              <button onClick={reset} className="btn-secondary">
                <RotateCcw className="h-4 w-4" /> Retake
              </button>
              <Link href="/coaching" className="btn-primary">
                Explore Coaching <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
