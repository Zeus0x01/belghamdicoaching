"use client";

import { TransformationTimeline } from "@/components/site/TransformationTimeline";
import { Reveal } from "@/components/ui/Reveal";
import { useAdminStore } from "@/lib/demo/admin-store";

export default function TransformationsPage() {
  const transformations = useAdminStore((s) => s.transformations).filter((t) => t.visible);

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">Transformations</p>
          <h1 className="heading-xl text-4xl md:text-7xl max-w-3xl">
            Journeys measured in <span className="text-copper">checkpoints.</span>
          </h1>
          <p className="body-lg mt-5 max-w-2xl">
            Instead of a before/after wall, we show the process: assessment weeks, volume phases,
            and peak blocks — each with measurable outcomes.
          </p>
        </Reveal>
        <div className="mt-16">
          <TransformationTimeline items={transformations} />
        </div>
        <p className="text-xs text-wgray-dim mt-10 text-center">
          Demo content shown. Real client transformations will replace these entries — never
          presented without verified consent.
        </p>
      </div>
    </div>
  );
}
