"use client";

import { useState } from "react";
import { EyeOff, Eye, Save } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import type { ContentTab, ContentEdit } from "@/lib/demo/admin-store";
import { logEvent } from "@/lib/integrations/dispatcher";

const SECTIONS = ["Homepage", "Programs", "Coaching packages", "Testimonials", "Transformation gallery", "FAQ"] as const;

type EditableTab = Extract<(typeof SECTIONS)[number], "Homepage" | "Programs" | "Coaching packages" | "FAQ">;

const TAB_KEYS: Record<EditableTab, ContentTab> = {
  Homepage: "homepage",
  Programs: "programs",
  "Coaching packages": "coaching",
  FAQ: "faq",
};

const FIELD_LABELS: Record<EditableTab, { title: string; body: string }> = {
  Homepage: { title: "Hero headline", body: "Hero subcopy" },
  Programs: { title: "Section heading", body: "Intro blurb" },
  "Coaching packages": { title: "Section heading", body: "Intro blurb" },
  FAQ: { title: "Section heading", body: "Intro blurb" },
};

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
        <SectionEditor key={section} section={section} />
      )}
    </div>
  );
}

function SectionEditor({ section }: { section: EditableTab }) {
  const { contentEdits, saveContentTab } = useAdminStore();
  const tab = TAB_KEYS[section];
  const labels = FIELD_LABELS[section];
  const stored = contentEdits[tab];
  const [form, setForm] = useState<ContentEdit>(stored);
  const [saved, setSaved] = useState(false);

  return (
    <div className="card-surface p-8 mt-8 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display font-semibold text-bone">{section}</h2>
        <button
          onClick={() => saveContentTab(tab, { visible: !stored.visible })}
          className="p-2 border border-wgray-dim text-wgray hover:text-bone shrink-0 transition-colors"
          aria-label={stored.visible ? `Hide ${section.toLowerCase()} section` : `Show ${section.toLowerCase()} section`}
        >
          {stored.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4 mt-6">
        <div>
          <label className="label-dark">{labels.title}</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-dark"
          />
        </div>
        <div>
          <label className="label-dark">{labels.body}</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={4}
            className="input-dark"
          />
        </div>
        {saved && (
          <p className="text-xs text-copper font-display uppercase tracking-widest">Saved</p>
        )}
        <button
          onClick={() => {
            saveContentTab(tab, { title: form.title, body: form.body });
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
          }}
          className="btn-primary"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <p className="text-xs text-wgray-dim mt-6 leading-relaxed">
        Demo mode — edits are stored locally and are not published to the public site. This is
        demo plumbing until the live content connection is configured.
      </p>
    </div>
  );
}
