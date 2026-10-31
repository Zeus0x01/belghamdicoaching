"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { Drawer, ConfirmDialog, StatusBadge } from "@/components/admin/ui";
import { AreaChart } from "@/components/admin/Charts";
import type { Client } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  fitnessGoal: "Build muscle",
  experienceLevel: "beginner" as Client["experienceLevel"],
  assignedProgram: "",
  coachingPackage: "none" as Client["coachingPackage"],
  subscriptionStatus: "pending" as Client["subscriptionStatus"],
  assignedCoach: "Coach Belghamdi",
  notes: "",
};

export default function AdminClientsPage() {
  const {
    clients,
    orders,
    subscriptions,
    progress,
    addClient,
    updateClient,
    deleteClient,
    addNote,
    notesFor,
    currency,
  } = useAdminStore();

  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [profile, setProfile] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [noteText, setNoteText] = useState("");

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [clients, query]
  );

  const save = () => {
    if (!form.name || !form.email) return;
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
      startDate: editing?.startDate ?? new Date().toISOString(),
    };
    if (editing) {
      updateClient(editing.id, { ...payload, startDate: editing.startDate });
    } else {
      addClient(payload);
    }
    setCreating(false);
    setEditing(null);
  };

  const profileClient = profile ? clients.find((c) => c.id === profile.id) ?? profile : null;
  const profileOrders = profileClient
    ? orders.filter(
        (o) => o.customerId === profileClient.id || o.customer === profileClient.name
      )
    : [];
  const profileSubs = profileClient
    ? subscriptions.filter((s) => s.clientId === profileClient.id)
    : [];
  const profileProgress = profileClient
    ? progress.filter((p) => p.clientId === profileClient.id).sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const profileNotes = profileClient ? notesFor("client", profileClient.id) : [];

  const weightTrend = profileProgress.map((p) => ({
    x: formatDate(p.date),
    y: p.weightKg,
  }));

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">Clients</h1>
          <p className="text-sm text-wgray mt-1">{clients.length} clients on record</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setCreating(true);
          }}
          className="btn-primary !px-5 !py-3"
        >
          <Plus className="h-4 w-4" /> New Client
        </button>
      </div>

      <div className="relative max-w-md mt-8">
        <Search className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients..."
          className="input-dark pl-9"
          aria-label="Search clients"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-wgray-dim py-20 text-center">No clients match your search.</p>
      ) : (
        <div className="card-surface mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                <th className="table-head">ID</th>
                <th className="table-head">Name</th>
                <th className="table-head">Program</th>
                <th className="table-head">Package</th>
                <th className="table-head">Status</th>
                <th className="table-head">Started</th>
                <th className="table-head text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-cell font-mono text-xs text-wgray">{client.id}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => setProfile(client)}
                      className="text-bone hover:text-copper transition-colors"
                    >
                      {client.name}
                    </button>
                  </td>
                  <td className="table-cell text-wgray">{client.assignedProgram}</td>
                  <td className="table-cell text-xs uppercase tracking-widest text-copper">
                    {client.coachingPackage}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={client.subscriptionStatus} />
                  </td>
                  <td className="table-cell text-xs text-wgray">{formatDate(client.startDate)}</td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setForm({
                            name: client.name,
                            email: client.email,
                            phone: client.phone,
                            age: client.age ? String(client.age) : "",
                            fitnessGoal: client.fitnessGoal,
                            experienceLevel: client.experienceLevel,
                            assignedProgram: client.assignedProgram,
                            coachingPackage: client.coachingPackage,
                            subscriptionStatus: client.subscriptionStatus,
                            assignedCoach: client.assignedCoach,
                            notes: client.notes,
                          });
                          setEditing(client);
                        }}
                        className="p-2 text-wgray hover:text-copper transition-colors"
                        aria-label={`Edit client ${client.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(client)}
                        className="p-2 text-wgray hover:text-red-400 transition-colors"
                        aria-label={`Delete client ${client.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={creating || editing !== null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? `Edit client — ${editing.id}` : "New client"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Age (optional)</label>
              <input
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value.replace(/\D/g, "") })}
                className="input-dark"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Fitness goal</label>
              <input value={form.fitnessGoal} onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Experience</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as Client["experienceLevel"] })}
                className="input-dark"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Assigned program</label>
              <input value={form.assignedProgram} onChange={(e) => setForm({ ...form, assignedProgram: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Coaching package</label>
              <select
                value={form.coachingPackage}
                onChange={(e) => setForm({ ...form, coachingPackage: e.target.value as Client["coachingPackage"] })}
                className="input-dark"
              >
                <option value="none">None (program-only)</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Subscription status</label>
              <select
                value={form.subscriptionStatus}
                onChange={(e) => setForm({ ...form, subscriptionStatus: e.target.value as Client["subscriptionStatus"] })}
                className="input-dark"
              >
                {["active", "pending", "expired", "cancelled", "on-hold"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-dark">Assigned coach</label>
              <input value={form.assignedCoach} onChange={(e) => setForm({ ...form, assignedCoach: e.target.value })} className="input-dark" />
            </div>
          </div>
          <div>
            <label className="label-dark">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-dark" />
          </div>
          <button onClick={save} className="btn-primary w-full">
            {editing ? "Save Changes" : "Create Client"}
          </button>
        </div>
      </Drawer>

      <Drawer
        wide
        open={profileClient !== null}
        onClose={() => setProfile(null)}
        title={profileClient ? profileClient.name : ""}
      >
        {profileClient && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="card-surface p-4">
                <p className="text-xs text-wgray uppercase tracking-widest">Purchases</p>
                <p className="font-display text-2xl text-bone mt-2">{profileOrders.length}</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-xs text-wgray uppercase tracking-widest">Check-ins</p>
                <p className="font-display text-2xl text-bone mt-2">{profileProgress.length}</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-xs text-wgray uppercase tracking-widest">Package</p>
                <p className="font-display text-2xl text-bone mt-2 capitalize">{profileClient.coachingPackage}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Purchase history</h3>
              {profileOrders.length === 0 ? (
                <p className="text-sm text-wgray-dim">No purchases recorded.</p>
              ) : (
                <div className="space-y-2">
                  {profileOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between bg-surface border border-wgray-dim/40 p-4">
                      <div>
                        <p className="text-sm text-bone">{o.productTitle}</p>
                        <p className="text-xs text-wgray-dim mt-0.5">{formatDate(o.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display text-bone">{formatMoney(o.total, currency)}</p>
                        <StatusBadge status={o.paymentStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Coaching history</h3>
              {profileSubs.length === 0 ? (
                <p className="text-sm text-wgray-dim">No coaching subscriptions.</p>
              ) : (
                <div className="space-y-2">
                  {profileSubs.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-surface border border-wgray-dim/40 p-4">
                      <div>
                        <p className="text-sm text-bone capitalize">{s.package} package</p>
                        <p className="text-xs text-wgray-dim mt-0.5">
                          {formatDate(s.startDate)} → {formatDate(s.renewalDate)}
                        </p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Weight trend</h3>
              <AreaChart data={weightTrend} height={140} label="Weight trend" />
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Progress records</h3>
              {profileProgress.length === 0 ? (
                <p className="text-sm text-wgray-dim">No check-ins recorded.</p>
              ) : (
                <ol className="border-l border-wgray-dim ml-2 space-y-4">
                  {[...profileProgress].reverse().map((p) => (
                    <li key={p.id} className="pl-5 relative">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-copper" />
                      <p className="text-sm text-bone">{formatDate(p.date)} — {p.weightKg} kg</p>
                      <p className="text-xs text-wgray mt-0.5">
                        Workouts {p.workoutCompletionPct}% · Nutrition {p.nutritionAdherencePct}%
                      </p>
                      {p.notes && <p className="text-xs text-wgray-dim mt-1">{p.notes}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <h3 className="font-display font-semibold text-bone mb-3">Internal notes</h3>
              {profileNotes.length > 0 && (
                <div className="space-y-3 mb-4">
                  {profileNotes.map((n) => (
                    <div key={n.id} className="bg-surface p-4 border border-wgray-dim/40">
                      <p className="text-sm text-bone">{n.note}</p>
                      <p className="text-xs text-wgray-dim mt-1">{n.author} — {formatDate(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add an internal note..."
                  className="input-dark flex-1"
                />
                <button
                  onClick={() => {
                    if (!noteText.trim()) return;
                    addNote({ entityType: "client", entityId: profileClient.id, note: noteText.trim() });
                    setNoteText("");
                  }}
                  className="btn-primary !px-4 !py-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete client"
        message={`This permanently removes ${deleting?.name} (${deleting?.id}).`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteClient(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
