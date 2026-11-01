"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import type { Transformation } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

function TransformationCard({ tr, index }: { tr: Transformation; index: number }) {
  const [open, setOpen] = useState(true);
  const { t } = useI18n();
  const weeksLabel = t("timeline_weeks_journey").replace("{weeks}", String(tr.weeks));
  return (
    <Reveal delay={index * 0.1} className="card-surface">
      <div className="p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            {tr.demo && (
              <span className="inline-block mb-3 text-[10px] font-display uppercase tracking-widest text-wgray border border-wgray-dim px-2 py-1">
                {t("demo_content_note")}
              </span>
            )}
            <h3 className="font-display font-semibold text-2xl text-bone">{tr.clientLabel}</h3>
            <p className="flex items-center gap-2 text-sm text-wgray mt-1">
              <Clock3 className="h-4 w-4 text-copper" /> {weeksLabel}
            </p>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs font-display uppercase tracking-widest text-copper hover:text-bone transition-colors"
          >
            {open ? t("timeline_collapse") : t("timeline_expand")}
          </button>
        </div>

        <p className="text-wgray text-sm mb-8 max-w-xl">{tr.summary}</p>

        {open && (
          <ol className="relative border-l border-wgray-dim ml-3 space-y-10">
            {tr.stages.map((stage, si) => (
              <motion.li
                key={si}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: si * 0.08 }}
                className="relative pl-8"
              >
                <span className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-copper border-4 border-obsidian" />
                <p className="text-xs font-display uppercase tracking-[0.25em] text-copper">
                  {t("timeline_week_label").replace("{week}", String(stage.week))}
                </p>
                <p className="font-display font-semibold text-lg text-bone mt-1">{stage.title}</p>
                <p className="text-sm text-wgray mt-1 leading-relaxed max-w-md">{stage.detail}</p>
                <p className="mt-2 font-serif text-lg text-copper">{stage.metric}</p>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </Reveal>
  );
}

export function TransformationTimeline({ items }: { items: Transformation[] }) {
  return (
    <div className="space-y-8">
      {items.map((tr, i) => (
        <TransformationCard key={tr.id} tr={tr} index={i} />
      ))}
    </div>
  );
}
