"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATALOG, CATEGORIES, type ProductCategory } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

type SortKey = "featured" | "price-asc" | "price-desc";

export default function ProgramsPage() {
  const { t } = useI18n();
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = CATALOG.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-4">{t("nav_programs")}</p>
        <h1 className="heading-xl text-5xl md:text-7xl max-w-3xl">
          {t("programs_title")} <span className="text-copper">{t("programs_title_accent")}</span>
        </h1>
        <p className="body-lg mt-5 max-w-2xl">{t("programs_copy")}</p>

        <div className="mt-12 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as (ProductCategory | "All")[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-xs font-display uppercase tracking-widest border transition-colors ${
                  category === c
                    ? "border-copper text-copper bg-copper/10"
                    : "border-wgray-dim text-wgray hover:text-bone hover:border-wgray"
                }`}
              >
                {c === "All" ? t("programs_filter_all") : c}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="h-4 w-4 text-wgray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("programs_search_placeholder")}
                aria-label={t("programs_search_aria")}
                className="input-dark pl-9 w-56"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label={t("programs_sort_aria")}
              className="input-dark w-44"
            >
              <option value="featured">{t("programs_sort_featured")}</option>
              <option value="price-asc">{t("programs_sort_price_asc")}</option>
              <option value="price-desc">{t("programs_sort_price_desc")}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-20 text-center text-wgray">{t("programs_empty")}</p>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
