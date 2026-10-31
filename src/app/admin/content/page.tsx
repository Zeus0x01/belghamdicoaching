"use client";

import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { logEvent } from "@/lib/integrations/dispatcher";

const SECTIONS = ["Homepage", "Programs", "Coaching packages", "Testimonials", "Transformation gallery", "FAQ"] as const;

export default function AdminContentPage() {
  const { testimonials, updateTestimonial, transformations, updateTransformation } = useAdminStore();
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("Homepage");

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">Content Management</h1>
        <p className="text-sm text-wgray mt-1">
          Update site content without touching source code. Changes apply immediately in demo mode.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-8">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`px-4 py-2 text-xs font-display uppercase tracking-widest border transition-colors ${
              section === s
                ? "border-copper text-copper bg-copper/10"
                : "border-wgray-dim text-wgray hover:text-bone"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {section === "Testimonials" && (
        <div className="space-y-4 mt-8">
          {testimonials.map((t) => (
            <div key={t.id} className="card-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-bone">
                    {t.clientName} <span className="text-wgray-dim text-xs">— {t.program}</span>
                  </p>
                  <p className="text-sm text-wgray mt-2 max-w-2xl">{t.quote}</p>
                  <p className="text-xs text-copper mt-2">
                    {"★".repeat(t.rating)} {t.demo && <span className="text-wgray-dim ml-2">demo content</span>}
                  </p>
                </div>
                <button
                  onClick={() => updateTestimonial(t.id, { visible: !t.visible })}
                  className="p-2 border border-wgray-dim text-wgray hover:text-bone shrink-0 transition-colors"
                  aria-label={t.visible ? "Hide testimonial" : "Show testimonial"}
                >
                  {t.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          <p className="text-xs text-wgray-dim">
            Real testimonials can be added here once actual client quotes are collected and consent
            is verified. Demo entries are clearly labeled on the public site.
          </p>
        </div>
      )}

      {section === "Transformation gallery" && (
        <div className="space-y-4 mt-8">
          {transformations.map((t) => (
            <div key={t.id} className="card-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-bone">{t.clientLabel}</p>
                  <p className="text-sm text-wgray mt-2 max-w-2xl">{t.summary}</p>
                  <p className="text-xs text-copper mt-2">
                    {t.weeks}-week journey · {t.stages.length} stages{" "}
                    {t.demo && <span className="text-wgray-dim ml-2">demo content</span>}
                  </p>
                  <button
                    onClick={() => updateTransformation(t.id, { visible: !t.visible })}
                    className="mt-4 text-xs font-display uppercase tracking-widest text-copper hover:text-bone transition-colors"
                  >
                    {t.visible ? "Hide from site" : "Publish to site"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(section === "Homepage" || section === "Programs" || section === "Coaching packages" || section === "FAQ") && (
        <div className="card-surface p-8 mt-8 max-w-2xl">
          <h2 className="font-display font-semibold text-bone mb-2">{section}</h2>
          <p className="text-sm text-wgray leading-relaxed">
            This section is managed through structured content fields. Once the Supabase
            connection is configured (content tables in the schema), text and imagery for{" "}
            <span className="text-bone">{section.toLowerCase()}</span> can be updated here and
            published instantly — no source code changes required.
          </p>
          <p className="text-xs text-wgray-dim mt-4">
            Layout, ordering, and section visibility are art-directed in code on purpose — keeping
            the design cohesive while content stays editable.
          </p>
          <p className="text-xs font-display uppercase tracking-widest text-wgray mt-6 border border-wgray-dim/60 px-4 py-3 inline-block">
            Staging area — connect Supabase to enable direct text publishing
          </p>
        </div>
      )}
    </div>
  );
}
