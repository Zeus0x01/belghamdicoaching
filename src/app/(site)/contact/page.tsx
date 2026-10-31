"use client";

import { useState } from "react";
import { Send, MessageCircle, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { logEvent } from "@/lib/integrations/dispatcher";
import { BUSINESS } from "@/lib/catalog";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-16">
        <Reveal>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="heading-xl text-4xl md:text-6xl">Let&apos;s talk training.</h1>
          <p className="body-lg mt-5">
            Coaching inquiries and program questions start here — the fastest answer is WhatsApp.
          </p>

          <div className="mt-12 space-y-6">
            <a
              href={BUSINESS.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 group"
            >
              <MessageCircle className="h-5 w-5 text-copper mt-1" />
              <div>
                <p className="font-display font-semibold text-bone text-sm uppercase tracking-widest group-hover:text-copper transition-colors">
                  WhatsApp — fastest
                </p>
                <p className="text-wgray text-sm mt-1">{BUSINESS.whatsapp}</p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-copper mt-1" />
              <div>
                <p className="font-display font-semibold text-bone text-sm uppercase tracking-widest">Email</p>
                <p className="text-wgray text-sm mt-1">{BUSINESS.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-copper mt-1" />
              <div>
                <p className="font-display font-semibold text-bone text-sm uppercase tracking-widest">Based in</p>
                <p className="text-wgray text-sm mt-1">
                  {BUSINESS.location} — coaching clients worldwide, online.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={BUSINESS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="border border-wgray-dim p-3 text-wgray hover:text-copper hover:border-copper transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="border border-wgray-dim p-3 text-wgray hover:text-copper hover:border-copper transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="border border-wgray-dim px-4 py-3 text-[11px] font-display uppercase tracking-widest text-wgray hover:text-copper hover:border-copper transition-colors"
              >
                TikTok
              </a>
              <a
                href={BUSINESS.socials.threads}
                target="_blank"
                rel="noreferrer"
                aria-label="Threads"
                className="border border-wgray-dim px-4 py-3 text-[11px] font-display uppercase tracking-widest text-wgray hover:text-copper hover:border-copper transition-colors"
              >
                Threads
              </a>
            </div>

            <a
              href={BUSINESS.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-wgray-dim px-6 py-4 text-sm font-display uppercase tracking-widest text-bone hover:border-copper hover:text-copper transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Message on WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="card-surface p-10 h-fit">
          {sent ? (
            <div className="border border-copper/50 bg-copper/10 p-8 text-center">
              <p className="font-display text-copper uppercase tracking-widest">
                Message sent
              </p>
              <p className="text-sm text-wgray mt-3">
                Your inquiry was captured. Expect a response within 48 hours.
              </p>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const type = data.get("type");
                logEvent("lead.created", `contact:${type}:${data.get("name")}`);
                setSent(true);
              }}
            >
              <div>
                <label htmlFor="type" className="label-dark">Inquiry type</label>
                <select id="type" name="type" className="input-dark">
                  <option value="general">General inquiry</option>
                  <option value="coaching">Coaching inquiry</option>
                  <option value="programs">Program question</option>
                </select>
              </div>
              <div>
                <label htmlFor="name" className="label-dark">Full name</label>
                <input id="name" name="name" required className="input-dark" />
              </div>
              <div>
                <label htmlFor="email" className="label-dark">Email</label>
                <input id="email" name="email" type="email" required className="input-dark" />
              </div>
              <div>
                <label htmlFor="phone" className="label-dark">Phone number</label>
                <input id="phone" name="phone" type="tel" className="input-dark" />
              </div>
              <div>
                <label htmlFor="message" className="label-dark">Message</label>
                <textarea id="message" name="message" rows={5} required className="input-dark" />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
