"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Instagram, Youtube, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/lib/catalog";
import { logEvent } from "@/lib/integrations/dispatcher";

const NEWSLETTER_KEY = "bc_newsletter";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIALS = [
  { label: "Instagram", href: BUSINESS.socials.instagram, Icon: Instagram },
  { label: "YouTube", href: BUSINESS.socials.youtube, Icon: Youtube },
  { label: "Mail", href: BUSINESS.whatsappLink, Icon: Mail },
  { label: "TikTok", href: BUSINESS.socials.tiktok, Icon: null },
  { label: "Threads", href: BUSINESS.socials.threads, Icon: null },
] as { label: string; href: string; Icon: typeof Instagram | null }[];

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/programs", label: "Programs" },
      { href: "/coaching", label: "Online Coaching" },
      { href: "/transformations", label: "Transformations" },
      { href: "/selector", label: "Program Selector" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About the Coach" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Client Login" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/faq#policies", label: "Terms" },
      { href: "/faq#policies", label: "Refund Policy" },
      { href: "/faq#policies", label: "Privacy" },
    ],
  },
];

export function Footer() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(true);
      return;
    }
    let list: string[] = [];
    try {
      list = JSON.parse(window.localStorage.getItem(NEWSLETTER_KEY) ?? "[]") as string[];
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    if (!list.includes(value)) {
      list.push(value);
      window.localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
    }
    logEvent("lead.created", `newsletter:${value}`);
    setError(false);
    setEmail("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-obsidian border-t border-wgray-dim/40 mt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] gap-12">
          <div>
            <img
              src="/logo.png"
              alt="Belghamdi Coaching"
              width={56}
              height={56}
              className="h-14 w-14 object-contain mb-4"
            />
            <p className="font-serif text-2xl text-wgray max-w-xs leading-snug">
              {t("footer_tagline")}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIALS.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 border border-wgray-dim flex items-center justify-center text-wgray hover:text-copper hover:border-copper transition-colors"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span className="text-[9px] font-display font-bold">{s.label[0]}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-display uppercase tracking-[0.3em] text-wgray mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-wgray hover:text-bone transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-wgray-dim/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md w-full">
            {subscribed ? (
              <p className="text-sm text-copper font-display uppercase tracking-widest">
                {t("newsletter_success")}
              </p>
            ) : (
              <>
                <form noValidate onSubmit={handleSubmit} className="flex items-center gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(false);
                    }}
                    placeholder={t("newsletter_placeholder")}
                    className="input-dark flex-1"
                    aria-label={t("newsletter_email_label")}
                  />
                  <button
                    type="submit"
                    className="p-3 border border-wgray-dim text-wgray hover:text-copper hover:border-copper transition-colors"
                    aria-label={t("newsletter_subscribe")}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                {error && (
                  <p className="text-xs text-copper mt-2">{t("newsletter_error")}</p>
                )}
              </>
            )}
          </div>
          <p className="text-xs text-wgray-dim">
            © {new Date().getFullYear()} Belghamdi Coaching — Bassam El Ghamdi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
