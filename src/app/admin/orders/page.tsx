"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { Drawer, StatusBadge } from "@/components/admin/ui";
import type { Order } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { orders, updateOrder, currency } = useAdminStore();
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<Order["paymentStatus"] | "all">("all");
  const [details, setDetails] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      orders
        .filter(
          (o) =>
            (paymentFilter === "all" || o.paymentStatus === paymentFilter) &&
            (o.customer.toLowerCase().includes(query.toLowerCase()) ||
              o.productTitle.toLowerCase().includes(query.toLowerCase()) ||
              o.id.toLowerCase().includes(query.toLowerCase()))
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [orders, query, paymentFilter]
  );

  const detailOrder = details ? orders.find((o) => o.id === details.id) ?? details : null;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-3xl text-bone">Orders</h1>
        <p className="text-sm text-wgray mt-1">
          {orders.length} orders — imported from the Shopify integration layer
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="input-dark pl-9"
            aria-label="Search orders"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "paid", "pending", "refunded"] as (Order["paymentStatus"] | "all")[]).map((s) => (
            <button
              key={s}
              onClick={() => setPaymentFilter(s)}
              className={`px-3 py-2 text-xs font-display uppercase tracking-widest border transition-colors ${
                paymentFilter === s
                  ? "border-copper text-copper bg-copper/10"
                  : "border-wgray-dim text-wgray hover:text-bone"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-wgray-dim py-20 text-center">No orders match your filters.</p>
      ) : (
        <div className="card-surface mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                <th className="table-head">Order</th>
                <th className="table-head">Shopify ID</th>
                <th className="table-head">Customer</th>
                <th className="table-head">Product</th>
                <th className="table-head">Total</th>
                <th className="table-head">Payment</th>
                <th className="table-head">Fulfillment</th>
                <th className="table-head">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-surface/40 transition-colors cursor-pointer"
                  onClick={() => setDetails(o)}
                >
                  <td className="table-cell font-mono text-xs text-copper">{o.id}</td>
                  <td className="table-cell font-mono text-xs text-wgray">{o.shopifyOrderId ?? "—"}</td>
                  <td className="table-cell">{o.customer}</td>
                  <td className="table-cell text-wgray">{o.productTitle}</td>
                  <td className="table-cell">{formatMoney(o.total, currency)}</td>
                  <td className="table-cell"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="table-cell"><StatusBadge status={o.fulfillmentStatus} /></td>
                  <td className="table-cell text-xs text-wgray">{formatDate(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={detailOrder !== null} onClose={() => setDetails(null)} title={detailOrder ? `Order ${detailOrder.id}` : ""}>
        {detailOrder && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-surface p-4">
                <p className="text-xs text-wgray uppercase tracking-widest">Total</p>
                <p className="font-display text-2xl text-bone mt-2">
                  {formatMoney(detailOrder.total, detailOrder.currency)}
                </p>
              </div>
              <div className="card-surface p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-wgray">Payment</span>
                  <StatusBadge status={detailOrder.paymentStatus} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-wgray">Fulfillment</span>
                  <StatusBadge status={detailOrder.fulfillmentStatus} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Customer</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between border-b border-wgray-dim/30 pb-2">
                  <dt className="text-wgray">Name</dt>
                  <dd className="text-bone">{detailOrder.customer}</dd>
                </div>
                <div className="flex justify-between border-b border-wgray-dim/30 pb-2">
                  <dt className="text-wgray">Client ID</dt>
                  <dd className="text-bone font-mono text-xs">{detailOrder.customerId ?? "Guest"}</dd>
                </div>
                <div className="flex justify-between border-b border-wgray-dim/30 pb-2">
                  <dt className="text-wgray">Product</dt>
                  <dd className="text-bone">{detailOrder.productTitle}</dd>
                </div>
                <div className="flex justify-between border-b border-wgray-dim/30 pb-2">
                  <dt className="text-wgray">Order date</dt>
                  <dd className="text-bone">{formatDate(detailOrder.date)}</dd>
                </div>
              </dl>
            </div>

            {detailOrder.demo && (
              <p className="text-xs border border-copper/40 bg-copper/5 text-copper p-4">
                Demo order — simulated for demonstration. Live orders will be imported from Shopify
                webhooks (order.paid / order.cancelled).
              </p>
            )}

            <div className="flex gap-3">
              <select
                value={detailOrder.fulfillmentStatus}
                onChange={(e) =>
                  updateOrder(detailOrder.id, { fulfillmentStatus: e.target.value as Order["fulfillmentStatus"] })
                }
                className="input-dark flex-1"
                aria-label="Update fulfillment status"
              >
                {["fulfilled", "unfulfilled", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Order timeline</h3>
              <ol className="border-l border-wgray-dim ml-2 space-y-4">
                {detailOrder.timeline.map((t, i) => (
                  <li key={i} className="pl-5 relative">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-copper" />
                    <p className="text-sm text-bone">{t.event}</p>
                    <p className="text-xs text-wgray-dim mt-0.5">{formatDate(t.at)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
