"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group card-surface relative overflow-hidden"
    >
      <Link href={`/programs/${product.slug}`} className="block">
        <div className="relative h-44 overflow-hidden border-b border-wgray-dim/50 bg-surface">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-7xl text-wgray-dim/40 group-hover:text-copper/40 transition-colors duration-500">
                {product.title
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
          <span className="absolute top-4 left-4 text-[10px] font-display uppercase tracking-[0.25em] text-copper bg-graphite/80 px-3 py-1.5">
            {product.category}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-lg text-bone leading-snug group-hover:text-copper transition-colors">
              {product.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 text-wgray-dim group-hover:text-copper transition-colors mt-1 shrink-0" />
          </div>
          <p className="text-sm text-wgray mt-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-xl text-bone">
                {formatMoney(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-wgray-dim line-through">
                  {formatMoney(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-xs font-display uppercase tracking-widest text-copper opacity-0 group-hover:opacity-100 transition-opacity">
              {t("cta_view_details")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
