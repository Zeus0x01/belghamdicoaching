"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DollarSign, ShoppingCart, Users, UserCheck, RefreshCcw, Percent } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { AreaChart, BarChart, DonutChart } from "@/components/admin/Charts";
import { StatusBadge } from "@/components/admin/ui";
import { formatDate, formatMoney } from "@/lib/utils";
import { isDemoMode } from "@/lib/mode";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-display uppercase tracking-widest text-wgray">{label}</span>
        <Icon className="h-4 w-4 text-copper" />
      </div>
      <p className="font-display font-bold text-3xl text-bone mt-4">{value}</p>
      {hint && <p className="text-xs text-wgray-dim mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { leads, clients, orders, subscriptions, progress, currency } = useAdminStore();
  const demo = isDemoMode();

  const revenue = useMemo(
    () => orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const activeClients = clients.filter((c) => c.subscriptionStatus === "active").length;
  const activeSubs = subscriptions.filter((s) => s.status === "active").length;
  const conversion = leads.length
    ? Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100)
    : 0;

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      if (o.paymentStatus !== "paid") continue;
      const key = new Date(o.date).toLocaleDateString("en-US", { month: "short" });
      map.set(key, (map.get(key) ?? 0) + o.total);
    }
    return Array.from(map.entries()).map(([x, y]) => ({ x, y }));
  }, [orders]);

  const ordersByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) map.set(o.productTitle, (map.get(o.productTitle) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 5);
  }, [orders]);

  const leadsBySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.source, (map.get(l.source) ?? 0) + 1);
    return Array.from(map.entries()).map(([x, y]) => ({ x, y }));
  }, [leads]);

  const subscriptionDist = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of subscriptions) map.set(s.package, (map.get(s.package) ?? 0) + 1);
    return Array.from(map.entries()).map(([x, y]) => ({ x, y }));
  }, [subscriptions]);

  const newClientsByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of clients) {
      const key = new Date(c.createdAt).toLocaleDateString("en-US", { month: "short" });
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([x, y]) => ({ x, y }));
  }, [clients]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">Overview</h1>
          <p className="text-sm text-wgray mt-1">
            Business snapshot — {demo ? "demo data" : "live data"}
          </p>
        </div>
        {demo && (
          <span className="text-[10px] font-display uppercase tracking-widest border border-copper/50 bg-copper/10 text-copper px-3 py-1.5">
            Demo Mode
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
        <StatCard icon={DollarSign} label="Revenue" value={formatMoney(revenue, currency)} hint={`${orders.filter((o) => o.paymentStatus === "paid").length} paid orders`} />
        <StatCard icon={ShoppingCart} label="Orders" value={String(orders.length)} />
        <StatCard icon={Users} label="Leads" value={String(leads.length)} hint={`${leads.filter((l) => l.status === "new").length} new`} />
        <StatCard icon={UserCheck} label="Clients" value={String(clients.length)} hint={`${activeClients} active`} />
        <StatCard icon={RefreshCcw} label="Subscriptions" value={String(activeSubs)} hint="active" />
        <StatCard icon={Percent} label="Conversion" value={`${conversion}%`} hint="leads → clients" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-bone mb-4">Revenue over time</h2>
          {revenueByMonth.length > 0 ? (
            <div className="text-xs flex gap-2 mb-2 text-wgray-dim">
              {revenueByMonth.map((d) => (
                <span key={d.x}>{d.x}</span>
              ))}
            </div>
          ) : null}
          <AreaChart data={revenueByMonth} label="Revenue over time" />
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-bone mb-4">Orders by product</h2>
          <BarChart data={ordersByProduct} label="Orders by product" />
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-bone mb-4">Leads by source</h2>
          <BarChart data={leadsBySource} label="Leads by source" />
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-bone mb-4">Subscription distribution</h2>
          {subscriptionDist.length > 0 ? (
            <DonutChart data={subscriptionDist} label="Subscription distribution" />
          ) : (
            <DonutChart data={subscriptionDist} label="Subscription distribution" />
          )}
        </div>
        <div className="card-surface p-6">
          <h2 className="font-display font-semibold text-bone mb-4">New customers</h2>
          {newClientsByMonth.length > 0 ? (
            <div className="text-xs flex gap-2 mb-2 text-wgray-dim">
              {newClientsByMonth.map((d) => (
                <span key={d.x}>{d.x}</span>
              ))}
            </div>
          ) : null}
          <AreaChart data={newClientsByMonth} label="New customers" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-bone">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-copper hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-wgray-dim py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-head">Order</th>
                    <th className="table-head">Customer</th>
                    <th className="table-head">Total</th>
                    <th className="table-head">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="table-cell font-mono text-xs">{o.id}</td>
                      <td className="table-cell">{o.customer}</td>
                      <td className="table-cell">{formatMoney(o.total, o.currency)}</td>
                      <td className="table-cell">
                        <StatusBadge status={o.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-bone">Recent leads</h2>
            <Link href="/admin/leads" className="text-xs text-copper hover:underline">
              View all
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-wgray-dim py-8 text-center">No leads recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-head">Name</th>
                    <th className="table-head">Interest</th>
                    <th className="table-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((l) => (
                    <tr key={l.id}>
                      <td className="table-cell">{l.fullName}</td>
                      <td className="table-cell text-wgray">{l.interestedProgram}</td>
                      <td className="table-cell">
                        <StatusBadge status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display font-semibold text-bone mb-4">Recent client activity</h2>
        {progress.length === 0 ? (
          <p className="text-sm text-wgray-dim">No check-ins recorded yet.</p>
        ) : (
          <div className="card-surface divide-y divide-wgray-dim/30">
            {progress.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm text-bone">
                    {p.clientName} submitted a check-in
                  </p>
                  <p className="text-xs text-wgray-dim mt-1">{formatDate(p.date)} — {p.workoutCompletionPct}% workout adherence</p>
                </div>
                <StatusBadge status="active" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
