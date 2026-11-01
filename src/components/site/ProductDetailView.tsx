"use client";

import { AddToCartButton } from "@/components/site/AddToCartButton";
import { INJURY_NOTE, type Product } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Check } from "lucide-react";

export function ProductDetailView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { t } = useI18n();

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 items-start">
          <div>
            <a
              href="/programs"
              className="inline-flex items-center gap-2 text-sm text-wgray hover:text-copper transition-colors mb-10"
            >
              <ArrowLeft className="h-4 w-4" /> {t("cta_all_programs")}
            </a>

            <div className="relative rounded-sm border border-wgray-dim/40 bg-obsidian aspect-[4/3] flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <span className="font-serif text-9xl text-wgray-dim/30">
                  {product.title
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
              <span className="absolute top-5 left-5 text-[10px] font-display uppercase tracking-[0.25em] text-copper bg-graphite px-3 py-1.5">
                {product.category}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[1, 2, 3].map((n) => (
                <a
                  key={n}
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-[4/3] rounded-sm border border-wgray-dim/30 bg-surface flex items-center justify-center text-xs text-wgray-dim font-display uppercase tracking-widest hover:text-copper hover:border-copper transition-colors"
                >
                  {t("product_view_n").replace("{n}", String(n))}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-3">{product.category}</p>
            <h1 className="heading-xl text-4xl md:text-5xl">{product.title}</h1>

            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display font-bold text-4xl text-bone">
                {formatMoney(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-wgray-dim line-through">
                  {formatMoney(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-wgray leading-relaxed mt-6">{product.description}</p>

            <div className="mt-6 p-4 border border-copper/40 bg-copper/5">
              <p className="text-xs text-copper font-display uppercase tracking-widest mb-2">
                {t("product_important_note")}
              </p>
              <p className="text-sm text-wgray">{INJURY_NOTE}</p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="border border-wgray-dim/40 p-4">
                <dt className="text-xs font-display uppercase tracking-widest text-wgray">
                  {t("product_frequency")}
                </dt>
                <dd className="font-display text-bone mt-1">{product.frequency}</dd>
              </div>
              <div className="border border-wgray-dim/40 p-4">
                <dt className="text-xs font-display uppercase tracking-widest text-wgray">
                  {t("product_level")}
                </dt>
                <dd className="font-display text-bone mt-1 capitalize">{product.level}</dd>
              </div>
            </dl>

            <p className="text-xs text-wgray mt-4">
              {t("product_for").replace("{audience}", product.audience)}
            </p>

            <div className="mt-10">
              <AddToCartButton productId={product.id} price={product.price} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 mt-24">
          <div>
            <h2 className="heading-lg text-2xl mb-6">{t("product_whats_included")}</h2>
            <ul className="space-y-3">
              {product.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-bone">
                  <Check className="h-5 w-5 text-copper mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="heading-lg text-2xl mb-6">{t("product_benefits_title")}</h2>
            <ul className="space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-bone">
                  <Check className="h-5 w-5 text-copper mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 p-6 border border-wgray-dim/40 bg-obsidian">
              <p className="text-xs font-display uppercase tracking-widest text-wgray mb-3">
                {t("product_video_library")}
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((v) => (
                  <div
                    key={v}
                    className="w-20 h-14 bg-surface border border-wgray-dim/40 flex items-center justify-center text-wgray-dim text-xs"
                  >
                    ▶ {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-28">
            <h2 className="heading-lg text-2xl mb-8">{t("product_related_title")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <a
                  key={r.id}
                  href={`/programs/${r.slug}`}
                  className="card-surface p-6 hover:border-copper transition-colors group"
                >
                  <p className="eyebrow mb-2">{r.category}</p>
                  <p className="font-display font-semibold text-lg text-bone group-hover:text-copper transition-colors">
                    {r.title}
                  </p>
                  <p className="text-sm text-wgray mt-2">{r.frequency}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
