"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus, Send, HelpCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { COACHING_PACKAGES } from "@/lib/catalog";
import { logEvent } from "@/lib/integrations/dispatcher";

const silver = COACHING_PACKAGES[0];
const gold = COACHING_PACKAGES[1];

const ROWS: { label: string; silver: string; gold: string }[] = [
  { label: "Follow-up frequency", silver: silver.followUp, gold: gold.followUp },
  { label: "Reporting", silver: silver.reporting, gold: gold.reporting },
  { label: "Response time", silver: silver.responseTime, gold: gold.responseTime },
  { label: "Support", silver: silver.support, gold: gold.support },
  { label: "Personalized training", silver: "Yes", gold: "Yes" },
  { label: "Nutrition plans", silver: "No", gold: "Yes" },
  { label: "Exercise explanations", silver: "Yes", gold: "Yes" },
  { label: "Adjustments based on progress", silver: "Every 2 weeks", gold: "Every week" },
];

const FAQS = [
  {
    q: "How fast do I get my plan?",
    a: "Plans are assembled after your intake form. Most clients receive their first program within 48 hours of purchase.",
  },
  {
    q: "Can I switch between Silver and Gold?",
    a: "Yes — changes apply at the next billing cycle. Your progress history carries over.",
  },
  {
    q: "What if I miss sessions?",
    a: "Reports are built around adherence, not perfection. Missed weeks trigger plan adjustments, not penalties.",
  },
];

export default function CoachingPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-4">Online Coaching</p>
        <h1 className="heading-xl text-5xl md:text-7xl max-w-3xl">
          Your plan adapts as <span className="text-copper">you adapt.</span>
        </h1>
        <p className="body-lg mt-5 max-w-2xl">
          Coaching philosophy: training with purpose, scientific programming, consistency, and
          progressive overload — supported by a coach who reads your check-ins weekly.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-5xl">
          <Reveal className="card-surface p-10">
            <p className="eyebrow mb-3">Silver — LE {silver.price}/mo</p>
            <h3 className="font-display font-bold text-3xl text-bone">Structured accountability.</h3>
            <ul className="mt-7 space-y-3 text-bone text-sm">
              {["Bi-weekly plan updates", "Progress report follow-up", "48h response window", "Exercise video library", "Email support"].map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="h-4 w-4 text-copper mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="card-surface p-10 border-copper/60 relative">
            <span className="absolute top-6 right-6 bg-copper text-graphite text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
              Most complete
            </span>
            <p className="eyebrow mb-3">Gold — LE {gold.price}/mo</p>
            <h3 className="font-display font-bold text-3xl text-bone">Full transformation system.</h3>
            <ul className="mt-7 space-y-3 text-bone text-sm">
              {["Weekly plan updates", "Weekly deep-dive reporting", "24h priority response", "Personalized nutrition plans", "Priority email support"].map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="h-4 w-4 text-copper mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-24 overflow-x-auto">
          <h2 className="heading-lg text-3xl mb-8">Feature comparison</h2>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="table-head">Feature</th>
                <th className="table-head">Silver</th>
                <th className="table-head">Gold</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
                return (
                  <tr key={r.label} className={i % 2 === 0 ? "bg-obsidian" : ""}>
                    <td className="table-cell font-medium">{r.label}</td>
                    <td className="table-cell text-wgray">{r.silver}</td>
                    <td className="table-cell text-bone">{r.gold}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-28 grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="heading-lg text-3xl mb-8 flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-copper" /> Coaching FAQ
            </h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <details key={f.q} className="card-surface p-6 group">
                  <summary className="font-display font-semibold text-bone cursor-pointer list-none flex justify-between items-center">
                    {f.q}
                    <Minus className="h-4 w-4 text-copper group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm text-wgray mt-4 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="text-sm text-copper mt-6 inline-flex items-center gap-2">
              General FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="card-surface p-10 h-fit">
            <p className="eyebrow mb-3">Application</p>
            <h2 className="heading-lg text-3xl">Apply for coaching.</h2>
            <p className="text-sm text-wgray mt-3">
              Tell us where you are and where you want to be. The coach reviews every application.
            </p>
            {sent ? (
              <div className="mt-8 border border-copper/50 bg-copper/10 p-6">
                <p className="font-display text-copper uppercase tracking-widest text-sm">
                  Application received
                </p>
                <p className="text-sm text-wgray mt-2">
                  Thanks — your application was captured. Expect a response within 48 hours.
                </p>
              </div>
            ) : (
              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  logEvent("lead.created", `coaching-application:${data.get("name")}`);
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="name" className="label-dark">Full name</label>
                  <input id="name" name="name" required className="input-dark" />
                </div>
                <div>
                  <label htmlFor="email" className="label-dark">Email</label>
                  <input id="email" name="email" type="email" required className="input-dark" />
                </div>
                <div>
                  <label htmlFor="goal" className="label-dark">Primary goal</label>
                  <select id="goal" name="goal" className="input-dark">
                    <option>Build muscle</option>
                    <option>Lose fat</option>
                    <option>Get stronger</option>
                    <option>Athletic performance</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="msg" className="label-dark">Your context</label>
                  <textarea id="msg" name="msg" rows={4} className="input-dark" placeholder="Experience, schedule, current stats..." />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4" /> Send Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
