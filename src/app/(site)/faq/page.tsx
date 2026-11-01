"use client";

import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function FaqPage() {
  const { t } = useI18n();

  const faqs = [
    { q: t("faq_1_q"), a: t("faq_1_a") },
    { q: t("faq_2_q"), a: t("faq_2_a") },
    { q: t("faq_3_q"), a: t("faq_3_a") },
    { q: t("faq_4_q"), a: t("faq_4_a") },
    { q: t("faq_5_q"), a: t("faq_5_a") },
    { q: t("faq_6_q"), a: t("faq_6_a") },
    { q: t("faq_7_q"), a: t("faq_7_a") },
  ];

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <p className="eyebrow mb-4">{t("faq_eyebrow")}</p>
          <h1 className="heading-xl text-4xl md:text-6xl">{t("faq_title")}</h1>
        </Reveal>
        <div className="mt-14 space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={i}>
              <details className="card-surface p-6 group">
                <summary className="font-display font-semibold text-bone cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-copper text-xl shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-wgray mt-4 leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <div id="policies" className="mt-20">
          <Reveal>
            <h2 className="heading-lg text-2xl mb-6">{t("faq_policies_title")}</h2>
            <div className="space-y-4 text-sm text-wgray leading-relaxed">
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">{t("faq_policy_refunds")}</span>
                {t("faq_policy_refunds_copy")}
              </p>
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">{t("faq_policy_terms")}</span>
                {t("faq_policy_terms_copy")}
              </p>
              <p>
                <span className="text-bone font-display uppercase tracking-widest block mb-1 text-xs">{t("faq_policy_privacy")}</span>
                {t("faq_policy_privacy_copy")}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-wgray text-sm">{t("faq_still_questions")}</p>
          <Link href="/contact" className="btn-secondary mt-5 inline-flex">
            {t("faq_contact_coach")}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
