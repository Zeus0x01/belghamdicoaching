"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Download, LineChart, MessagesSquare } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { ProductCard } from "@/components/site/ProductCard";
import { AnatomyExplorer } from "@/components/three/AnatomyExplorer";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Philosophy, HowItWorks, Testimonials, FinalCTA } from "@/components/site/HomeSections";
import { TransformationTimeline } from "@/components/site/TransformationTimeline";
import { CATALOG } from "@/lib/catalog";
import { useAdminStore } from "@/lib/demo/admin-store";

export default function HomePage() {
  const transformations = useAdminStore((s) => s.transformations).filter((t) => t.visible);
  const setSeed = useAdminStore((s) => s.setSeed);

  useEffect(() => {
    setSeed();
  }, [setSeed]);

  const featured = CATALOG.filter((p) =>
    ["anterior-x-posterior", "push-pull-leg-x-upper-lower", "upper-lower-4-days"].includes(p.slug)
  );

  return (
    <>
      <>
        <Hero />

        <Philosophy />

        <section className="py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Training Programs"
                title="Programs engineered for outcomes."
                copy="Structured plans with clear progression — from your first week of training to advanced hypertrophy work."
              />
              <Reveal delay={0.15}>
                <Link href="/programs" className="btn-secondary">
                  All Programs <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 bg-obsidian">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <SectionHeading
              eyebrow="Online Coaching"
              title="Coach in your corner. Every week."
              copy="Silver and Gold coaching tracks keep your plan evolving with your progress — not fading after week six."
            />
            <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl">
              <Reveal className="card-surface p-10">
                <p className="eyebrow mb-3">Silver</p>
                <p className="font-serif text-5xl text-bone">Bi-weekly</p>
                <p className="text-wgray text-sm mt-4 leading-relaxed">
                  Personalized training, exercise breakdowns, and a progress report every two
                  weeks.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="card-surface p-10 border-copper/50">
                <p className="eyebrow mb-3">Gold</p>
                <p className="font-serif text-5xl text-copper">Weekly</p>
                <p className="text-wgray text-sm mt-4 leading-relaxed">
                  Everything in Silver plus nutrition planning, weekly deep-dive reviews, and
                  priority responses.
                </p>
              </Reveal>
            </div>
            <div className="mt-10 flex gap-4">
              <Link href="/coaching" className="btn-primary">
                Compare Coaching <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <AnatomyExplorer />
          </div>
        </section>

        <HowItWorks />

        <section className="py-28 bg-obsidian">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-8">
            {[
              { icon: Download, title: "Instant PDF delivery", copy: "Every program includes a print-ready plan." },
              { icon: LineChart, title: "Data-driven check-ins", copy: "Weight trends, adherence, and workload tracked." },
              { icon: MessagesSquare, title: "Direct coach access", copy: "Real adjustments from real feedback." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08} className="text-left">
                <f.icon className="h-6 w-6 text-copper" />
                <h3 className="font-display font-semibold text-lg mt-4 text-bone">{f.title}</h3>
                <p className="text-sm text-wgray mt-2">{f.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <Testimonials />

        <section className="py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <SectionHeading
              eyebrow="Transformations"
              title="Progress is a timeline, not a photo."
              copy="Our clients' journeys follow weekly checkpoints. Explore sample demo timelines below."
            />
            <div className="mt-14 grid lg:grid-cols-2 gap-6">
              <TransformationTimeline items={transformations.slice(0, 1)} />
              <TransformationTimeline items={transformations.slice(1, 2)} />
            </div>
            <div className="mt-10">
              <Link href="/transformations" className="btn-secondary">
                Explore All Journeys <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </>
      <FinalCTA />
    </>
  );
}
