"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { cartProducts, useCart, cartTotal } from "@/lib/cart";
import { logEvent } from "@/lib/integrations/dispatcher";
import { useAdminStore } from "@/lib/demo/admin-store";
import { motion } from "framer-motion";
import { formatMoney } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export default function CheckoutPage() {
  const { t } = useI18n();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const addOrder = useAdminStore((s) => s.addOrder);
  const lines = cartProducts(items);
  const total = cartTotal(items);
  const [done, setDone] = useState<string | null>(null);

  if (done) {
    return (
      <div className="pt-40 pb-32">
        <div className="max-w-md mx-auto px-6 text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <CheckCircle2 className="h-16 w-16 text-copper mx-auto" />
          </motion.div>
          <h1 className="heading-xl text-4xl mt-8">{t("checkout_confirmed_title")}</h1>
          <p className="body-lg mt-4">
            {t("checkout_confirmed_prefix")}{" "}
            <span className="text-copper font-display">{done}</span>{" "}
            {t("checkout_confirmed_suffix")}
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Link href="/programs" className="btn-primary">
              {t("checkout_cta_keep_exploring")}
            </Link>
            <Link href="/login" className="btn-secondary">
              {t("nav_login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="pt-40 pb-32 text-center px-6">
        <h1 className="heading-xl text-3xl">{t("cart_empty")}</h1>
        <Link href="/programs" className="btn-primary mt-8 inline-flex">
          {t("cart_browse_programs")}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.2fr_1fr] gap-14">
        <div>
          <p className="eyebrow mb-4">{t("checkout_eyebrow")}</p>
          <h1 className="heading-xl text-4xl md:text-5xl">{t("checkout_title")}</h1>
          <form
            className="mt-10 card-surface p-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = String(data.get("name") || "Guest");
              const email = String(data.get("email") || "");
              const orderId = `od-0${Math.floor(700 + Math.random() * 99)}`;
              const now = new Date().toISOString();
              addOrder({
                customer: name,
                productTitle: lines.map((l) => l.product.title).join(", "),
                total,
                currency: "EGP",
                paymentStatus: "paid",
                fulfillmentStatus: "unfulfilled",
                date: now,
                timeline: [
                  { at: now, event: `Order created (demo) — ${lines.length} item(s)` },
                  { at: now, event: "Payment captured (demo)" },
                ],
                demo: true,
              });
              logEvent("order.paid", `${orderId}:${email}`);
              clear();
              setDone(orderId);
            }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="label-dark">{t("checkout_label_full_name")}</label>
                <input id="name" name="name" required className="input-dark" />
              </div>
              <div>
                <label htmlFor="email" className="label-dark">{t("checkout_label_email")}</label>
                <input id="email" name="email" type="email" required className="input-dark" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="label-dark">{t("checkout_label_phone")}</label>
              <input id="phone" name="phone" type="tel" className="input-dark" />
            </div>
            <div>
              <label htmlFor="goal" className="label-dark">{t("checkout_label_goal")}</label>
              <select id="goal" name="goal" className="input-dark">
                <option>{t("checkout_goal_muscle")}</option>
                <option>{t("checkout_goal_fat")}</option>
                <option>{t("checkout_goal_strength")}</option>
                <option>{t("checkout_goal_athletic")}</option>
              </select>
            </div>

            <div className="border border-wgray-dim/50 p-5 bg-obsidian">
              <p className="flex items-center gap-2 text-sm font-display uppercase tracking-widest text-copper">
                <ShieldCheck className="h-4 w-4" /> {t("checkout_demo_payment")}
              </p>
              <p className="text-xs text-wgray mt-2 leading-relaxed">
                {t("checkout_demo_note")}
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              {t("checkout_simulate").replace("{total}", formatMoney(total))}
            </button>
          </form>
        </div>

        <div className="card-surface p-8 h-fit">
          <h2 className="font-display font-semibold uppercase tracking-widest text-sm text-wgray mb-6">
            {t("checkout_summary_title")}
          </h2>
          <div className="space-y-4">
            {lines.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-bone">
                  {product.title} <span className="text-wgray">× {quantity}</span>
                </span>
                <span className="font-display">{formatMoney(product.price * quantity)}</span>
              </div>
            ))}
            <div className="border-t border-wgray-dim/60 pt-4 flex justify-between font-display font-bold text-lg">
              <span>{t("checkout_total")}</span>
              <span className="text-copper">{formatMoney(total)}</span>
            </div>
          </div>
          <p className="text-[11px] text-wgray-dim mt-6 leading-relaxed">
            {t("checkout_delivery_note")}
          </p>
        </div>
      </div>
    </div>
  );
}
