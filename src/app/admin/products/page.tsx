"use client";

import { useMemo, useState } from "react";
import { Search, CloudOff, Cloud } from "lucide-react";
import { CATALOG, CATEGORIES, type ProductCategory } from "@/lib/catalog";
import { integrationStatus } from "@/lib/mode";
import { formatMoney } from "@/lib/utils";

export default function AdminProductsPage() {
  const integrations = integrationStatus();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "All">("All");

  const products = useMemo(
    () =>
      CATALOG.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.title.toLowerCase().includes(query.toLowerCase())
      ),
    [query, category]
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">Products</h1>
          <p className="text-sm text-wgray mt-1">
            {CATALOG.length} products — source of truth: Shopify
          </p>
        </div>
        <span className="flex items-center gap-2 text-xs border border-wgray-dim px-3 py-2 text-wgray">
          {integrations.shopify ? (
            <>
              <Cloud className="h-4 w-4 text-emerald-400" /> Shopify sync configured
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4 text-copper" /> Shopify not configured — demo catalog
            </>
          )}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="input-dark pl-9"
            aria-label="Search products"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory | "All")}
          className="input-dark w-56"
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="card-surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className="table-head">ID</th>
              <th className="table-head">Product</th>
              <th className="table-head">Category</th>
              <th className="table-head">Price</th>
              <th className="table-head">Compare-at</th>
              <th className="table-head">Status</th>
              <th className="table-head">Sync</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                <td className="table-cell font-mono text-xs text-wgray">{p.id}</td>
                <td className="table-cell">
                  <p className="text-bone">{p.title}</p>
                  <p className="text-xs text-wgray-dim mt-0.5">{p.frequency}</p>
                </td>
                <td className="table-cell text-xs text-wgray">{p.category}</td>
                <td className="table-cell">{formatMoney(p.price)}</td>
                <td className="table-cell text-wgray">
                  {p.compareAtPrice ? formatMoney(p.compareAtPrice) : "—"}
                </td>
                <td className="table-cell">
                  <span className="text-[10px] font-display uppercase tracking-widest text-emerald-300 border border-emerald-400/30 bg-emerald-400/10 px-2 py-1">
                    Active
                  </span>
                </td>
                <td className="table-cell">
                  {integrations.shopify ? (
                    <span className="text-xs text-emerald-400">Linked</span>
                  ) : (
                    <span className="text-xs text-wgray-dim">Demo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-wgray-dim mt-6 max-w-2xl leading-relaxed">
        Editing is intentionally disabled here: Shopify remains the commerce source of truth.
        Prices, inventory, and product content are managed in Shopify and synchronized through
        the integration layer. This view is read-only.
      </p>
    </div>
  );
}
