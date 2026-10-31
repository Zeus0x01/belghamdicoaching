"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATALOG, CATEGORIES, type ProductCategory } from "@/lib/catalog";

type SortKey = "featured" | "price-asc" | "price-desc";

export default function ProgramsPage() {
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
        <p className="eyebrow mb-4">Programs</p>
        <h1 className="heading-xl text-5xl md:text-7xl max-w-3xl">
          Pick your <span className="text-copper">battle plan.</span>
        </h1>
        <p className="body-lg mt-5 max-w-2xl">
          Every program is structured for progression. Filter by category, find your fit, and
          start this week.
        </p>

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
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="h-4 w-4 text-wgray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs"
                aria-label="Search programs"
                className="input-dark pl-9 w-56"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort programs"
              className="input-dark w-44"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-20 text-center text-wgray">
            No programs match your filters. Try clearing the search.
          </p>
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
