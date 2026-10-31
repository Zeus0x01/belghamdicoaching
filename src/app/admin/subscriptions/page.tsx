"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { Drawer, ConfirmDialog, StatusBadge, STATUS_STYLES } from "@/components/admin/ui";
import type { Subscription } from "@/lib/types";
import { logEvent } from "@/lib/integrations/dispatcher";
import { formatDate } from "@/lib/utils";

const STATUSES: Subscription["status"][] = ["active", "pending", "expired", "cancelled", "on-hold"];

export default function AdminSubscriptionsPage() {
  const { subscriptions, clients, addSubscription, updateSubscription, deleteSubscription } =
    useAdminStore();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Subscription | null>(null);
  const [form, setForm] = useState({
    clientId: "",
    package: "silver" as Subscription["package"],
    startDate: new Date().toISOString().slice(0, 10),
    renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: "pending" as Subscription["status"],
    paymentStatus: "pending" as Subscription["paymentStatus"],
    assignedCoach: "Coach Belghamdi",
  });

  const selectedClient = clients.find((c) => c.id === form.clientId);

  const create = () => {
    if (!selectedClient) return;
    addSubscription({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      package: form.package,
      startDate: new Date(form.startDate).toISOString(),
      renewalDate: new Date(form.renewalDate).toISOString(),
      status: form.status,
      paymentStatus: form.paymentStatus,
      assignedCoach: form.assignedCoach,
    });
    logEvent("subscription.created", selectedClient.id);
    setCreating(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">Subscriptions</h1>
          <p className="text-sm text-wgray mt-1">
            {subscriptions.length} subscriptions — recurring billing integration structure prepared
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary !px-5 !py-3">
          <Plus className="h-4 w-4" /> New Subscription
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-sm text-wgray-dim py-20 text-center">No subscriptions yet.</p>
      ) : (
        <div className="card-surface mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <th className="table-head">ID</th>
                <th className="table-head">Client</th>
                <th className="table-head">Package</th>
                <th className="table-head">Renewal</th>
                <th className="table-head">Status</th>
                <th className="table-head">Payment</th>
                <th className="table-head text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => {
                const overdue = new Date(s.renewalDate).getTime() < Date.now() && s.status === "active";
                return (
                  <tr key={s.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-cell font-mono text-xs text-wgray">{s.id}</td>
                    <td className="table-cell">{s.clientName}</td>
                    <td className="table-cell text-xs uppercase tracking-widest text-copper">
                      {s.package}
                    </td>
                    <td className={`table-cell text-xs ${overdue ? "text-orange-300" : "text-wgray"}`}>
                      {formatDate(s.renewalDate)}
                      {overdue && " (overdue)"}
                    </td>
                    <td className="table-cell">
                      <select
                        value={s.status}
                        onChange={(e) => {
                          const next = e.target.value as Subscription["status"];
                          updateSubscription(s.id, { status: next });
                          if (next === "expired") {
                            logEvent("subscription.expired", s.id);
                          } else if (next === "active") {
                            logEvent("subscription.renewed", s.id);
                          }
                        }}
                        className={`text-[10px] font-display uppercase tracking-widest border px-2 py-1 cursor-pointer bg-transparent ${STATUS_STYLES[s.status]}`}
                        aria-label={`Update status for ${s.id}`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st} className="bg-obsidian text-bone">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell">
                      <select
                        value={s.paymentStatus}
                        onChange={(e) =>
                          updateSubscription(s.id, { paymentStatus: e.target.value as Subscription["paymentStatus"] })
                        }
                        className="input-dark !px-2 !py-1 text-xs w-28"
                        aria-label={`Update payment status for ${s.id}`}
                      >
                        {["paid", "pending", "failed"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setDeleting(s)}
                          className="p-2 text-wgray hover:text-red-400 transition-colors"
                          aria-label={`Delete subscription ${s.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-wgray-dim mt-6 max-w-2xl leading-relaxed">
        Not every Shopify order represents a recurring subscription. Coaching subscriptions are
        tracked separately here, with structure ready for recurring billing integration.
      </p>

      <Drawer open={creating} onClose={() => setCreating(false)} title="New subscription">
        <div className="space-y-4">
          <div>
            <label className="label-dark">Client</label>
            <select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="input-dark"
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Package</label>
              <select
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value as Subscription["package"] })}
                className="input-dark"
              >
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            <div>
              <label className="label-dark">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Subscription["status"] })}
                className="input-dark"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Start date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Renewal date</label>
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                className="input-dark"
              />
            </div>
          </div>
          <div>
            <label className="label-dark">Payment status</label>
            <select
              value={form.paymentStatus}
              onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as Subscription["paymentStatus"] })}
              className="input-dark"
            >
              {["paid", "pending", "failed"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <button onClick={create} disabled={!selectedClient} className="btn-primary w-full disabled:opacity-40">
            Create Subscription
          </button>
        </div>
      </Drawer>

      <ConfirmDialog
        open={deleting !== null}
        title="Cancel subscription record"
        message={`Remove ${deleting?.clientName}&apos;s subscription (${deleting?.package} package)? The client record remains.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteSubscription(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
