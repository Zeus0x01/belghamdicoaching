"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { cartProducts, useCart, cartTotal } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const { t } = useI18n();

  const lines = cartProducts(items);
  const total = cartTotal(items);

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-4">{t("nav_cart")}</p>
        <h1 className="heading-xl text-4xl md:text-6xl">{t("cart_title")}</h1>

        {lines.length === 0 ? (
          <div className="mt-20 text-center">
            <ShoppingBag className="h-10 w-10 text-wgray-dim mx-auto" />
            <p className="text-wgray mt-6">{t("cart_empty")}</p>
            <Link href="/programs" className="btn-primary mt-8">
              {t("cart_browse_programs")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid lg:grid-cols-[1.4fr_1fr] gap-12">
            <div className="space-y-4">
              {lines.map(({ product, quantity }) => (
                <div key={product.id} className="card-surface p-5 flex items-center gap-5">
                  <div className="w-20 h-20 bg-surface border border-wgray-dim/40 flex items-center justify-center shrink-0">
                    <span className="font-serif text-2xl text-wgray-dim/50">
                      {product.title
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/programs/${product.slug}`}
                      className="font-display font-semibold text-bone hover:text-copper transition-colors"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-wgray mt-1 uppercase tracking-widest">
                      {product.category} · {product.frequency}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        className="p-1.5 border border-wgray-dim text-wgray hover:text-bone transition-colors"
                        aria-label={t("cart_qty_decrease")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-display w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        className="p-1.5 border border-wgray-dim text-wgray hover:text-bone transition-colors"
                        aria-label={t("cart_qty_increase")}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(product.id)}
                        className="p-1.5 text-wgray-dim hover:text-red-400 transition-colors ml-2"
                        aria-label={t("cart_qty_remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-display font-bold text-lg text-bone">
                    LE {product.price * quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="card-surface p-8 h-fit">
              <h2 className="font-display font-semibold uppercase tracking-widest text-sm text-wgray">
                {t("cart_summary_title")}
              </h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-wgray">
                  <span>{t("cart_subtotal")}</span>
                  <span className="text-bone">LE {total}</span>
                </div>
                <div className="flex justify-between text-wgray">
                  <span>{t("cart_delivery")}</span>
                  <span className="text-bone">{t("cart_delivery_value")}</span>
                </div>
                <div className="border-t border-wgray-dim/60 pt-3 flex justify-between font-display font-bold text-lg">
                  <span>{t("cart_total")}</span>
                  <span className="text-copper">LE {total}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="btn-primary w-full mt-8"
              >
                {t("cart_checkout_cta")} <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[11px] text-wgray-dim mt-4 leading-relaxed">
                {t("cart_demo_note")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
