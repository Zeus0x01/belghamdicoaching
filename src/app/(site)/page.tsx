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
import { useI18n } from "@/lib/i18n";
import { useAdminStore } from "@/lib/demo/admin-store";

export default function HomePage() {
  const { t } = useI18n();
  const transformations = useAdminStore((s) => s.transformations).filter((tr) => tr.visible);
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
                eyebrow={t("section_programs")}
                title={t("home_prog_title")}
                copy={t("home_prog_copy")}
              />
              <Reveal delay={0.15}>
                <Link href="/programs" className="btn-secondary">
                  {t("cta_all_programs")} <ArrowRight className="h-4 w-4" />
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
              eyebrow={t("section_coaching")}
              title={t("home_coach_title")}
              copy={t("home_coach_copy")}
            />
            <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl">
              <Reveal className="card-surface p-10">
                <p className="eyebrow mb-3">{t("coaching_tier_silver")}</p>
                <p className="font-serif text-5xl text-bone">{t("home_coach_silver_freq")}</p>
                <p className="text-wgray text-sm mt-4 leading-relaxed">
                  {t("home_coach_silver_copy")}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="card-surface p-10 border-copper/50">
                <p className="eyebrow mb-3">{t("coaching_tier_gold")}</p>
                <p className="font-serif text-5xl text-copper">{t("home_coach_gold_freq")}</p>
                <p className="text-wgray text-sm mt-4 leading-relaxed">
                  {t("home_coach_gold_copy")}
                </p>
              </Reveal>
            </div>
            <div className="mt-14 max-w-4xl overflow-x-auto">
              <p className="text-xs font-display uppercase tracking-[0.3em] text-wgray mb-6">
                {t("coaching_compare_title")}
              </p>
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr>
                    <th className="table-head">{t("coaching_table_feature")}</th>
                    <th className="table-head">{t("coaching_tier_silver")}</th>
                    <th className="table-head">{t("coaching_tier_gold")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                  {
                    key: "coaching_row_followup",
                    silver: t("coaching_val_followup"),
                    gold: t("coaching_val_gold_followup"),
                  },
                  {
                    key: "coaching_row_reporting",
                    silver: t("coaching_val_reporting"),
                    gold: t("coaching_val_gold_reporting"),
                  },
                  {
                    key: "coaching_row_response",
                    silver: t("coaching_val_response"),
                    gold: t("coaching_val_gold_response"),
                  },
                  {
                    key: "coaching_row_support",
                    silver: t("coaching_val_support"),
                    gold: t("coaching_val_gold_support"),
                  },
                  ].map((r) => (
                    <tr key={r.key}>
                      <td className="table-cell font-medium">{t(r.key)}</td>
                      <td className="table-cell text-wgray">{r.silver}</td>
                      <td className="table-cell text-bone">{r.gold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex gap-4">
              <Link href="/coaching" className="btn-primary">
                {t("cta_compare_coaching")} <ArrowRight className="h-4 w-4" />
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
              { icon: Download, key: "home_feat_1_title", copyKey: "home_feat_1_copy" },
              { icon: LineChart, key: "home_feat_2_title", copyKey: "home_feat_2_copy" },
              { icon: MessagesSquare, key: "home_feat_3_title", copyKey: "home_feat_3_copy" },
            ].map((f, i) => (
              <Reveal key={f.key} delay={i * 0.08} className="text-left">
                <f.icon className="h-6 w-6 text-copper" />
                <h3 className="font-display font-semibold text-lg mt-4 text-bone">{t(f.key)}</h3>
                <p className="text-sm text-wgray mt-2">{t(f.copyKey)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <Testimonials />

        <section className="py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <SectionHeading
              eyebrow={t("section_transformations")}
              title={t("home_timeline_title")}
              copy={t("home_timeline_copy")}
            />
            <div className="mt-14 grid lg:grid-cols-2 gap-6">
              <TransformationTimeline items={transformations.slice(0, 1)} />
              <TransformationTimeline items={transformations.slice(1, 2)} />
            </div>
            <div className="mt-10">
              <Link href="/transformations" className="btn-secondary">
                {t("cta_explore_journeys")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </>
      <FinalCTA />
    </>
  );
}
