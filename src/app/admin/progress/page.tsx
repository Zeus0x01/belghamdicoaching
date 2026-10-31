"use client";

import { useMemo, useState } from "react";
import { Plus, Camera } from "lucide-react";
import { useAdminStore } from "@/lib/demo/admin-store";
import { AreaChart } from "@/components/admin/Charts";
import { Drawer } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { logEvent } from "@/lib/integrations/dispatcher";

export default function AdminProgressPage() {
  const { progress, clients, addProgress } = useAdminStore();

  const personIds = useMemo(
    () => Array.from(new Set(progress.map((p) => p.clientId).filter((id): id is string => Boolean(id)))),
    [progress]
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    weightKg: "",
    targetWeightKg: "",
    heightCm: "",
    workoutCompletionPct: "100",
    nutritionAdherencePct: "80",
    notes: "",
  });

  const activeId = selected ?? personIds[0] ?? null;
  const activeClient = clients.find((c) => c.id === activeId);
  const records = progress
    .filter((p) => p.clientId === activeId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const trend = [...records].reverse().map((r) => ({ x: formatDate(r.date), y: r.weightKg }));
  const latest = records[0];

  const submit = () => {
    if (!activeId || !form.weightKg) return;
    addProgress({
      clientId: activeId,
      clientName: activeClient?.name ?? activeId,
      date: new Date().toISOString(),
      weightKg: Number(form.weightKg),
      targetWeightKg: Number(form.targetWeightKg || latest?.targetWeightKg || 0),
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      workoutCompletionPct: Math.min(100, Math.max(0, Number(form.workoutCompletionPct || 0))),
      nutritionAdherencePct: Math.min(100, Math.max(0, Number(form.nutritionAdherencePct || 0))),
      notes: form.notes,
    });
    logEvent("progress.submitted", activeId);
    setAdding(false);
    setForm({ weightKg: "", targetWeightKg: "", heightCm: "", workoutCompletionPct: "100", nutritionAdherencePct: "80", notes: "" });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-bone">Progress Tracking</h1>
          <p className="text-sm text-wgray mt-1">Client check-ins and trends — restricted to authorized staff</p>
        </div>
        <button onClick={() => setAdding(true)} disabled={!activeId} className="btn-primary !px-5 !py-3 disabled:opacity-40">
          <Plus className="h-4 w-4" /> New Check-in
        </button>
      </div>

      {personIds.length === 0 ? (
        <p className="text-sm text-wgray-dim py-20 text-center">No progress data yet — check-ins will appear here.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mt-8">
            {clients
              .filter((c) => personIds.includes(c.id))
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`px-4 py-2 text-xs font-display uppercase tracking-widest border transition-colors ${
                    activeId === c.id
                      ? "border-copper text-copper bg-copper/10"
                      : "border-wgray-dim text-wgray hover:text-bone"
                  }`}
                >
                  {c.name}
                </button>
              ))}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-8">
            <div className="card-surface p-6">
              <h2 className="font-display font-semibold text-bone mb-4">Weight trend — {activeClient?.name}</h2>
              <AreaChart data={trend} height={220} label="Weight trend" />
              {latest && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-wgray uppercase tracking-widest">Current</p>
                    <p className="font-display text-xl text-bone mt-1">{latest.weightKg} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-wgray uppercase tracking-widest">Target</p>
                    <p className="font-display text-xl text-bone mt-1">{latest.targetWeightKg} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-wgray uppercase tracking-widest">To go</p>
                    <p className="font-display text-xl text-copper mt-1">
                      {Math.abs(latest.weightKg - latest.targetWeightKg).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              )}
            </div>

            {latest && (
              <div className="card-surface p-6">
                <h2 className="font-display font-semibold text-bone mb-4">Latest check-in</h2>
                <p className="text-xs text-wgray">{formatDate(latest.date)}</p>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Workout completion", value: latest.workoutCompletionPct },
                    { label: "Nutrition adherence", value: latest.nutritionAdherencePct },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-wgray">{m.label}</span>
                        <span className="text-bone font-display">{m.value}%</span>
                      </div>
                      <div className="h-2 bg-graphite border border-wgray-dim/30">
                        <div className="h-full bg-copper" style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {latest.notes && (
                  <div className="mt-6 border-l-2 border-copper pl-4">
                    <p className="text-xs text-wgray uppercase tracking-widest mb-1">Coach note</p>
                    <p className="text-sm text-bone">{latest.notes}</p>
                  </div>
                )}
                {latest.photoRef && (
                  <p className="flex items-center gap-2 text-xs text-wgray-dim mt-6">
                    <Camera className="h-4 w-4" /> Progress photo stored: {latest.photoRef} (Supabase Storage)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="card-surface mt-6">
            <h2 className="px-6 pt-6 pb-4 font-display font-semibold text-bone">Check-in timeline</h2>
            <ol className="px-6 pb-6 border-l border-wgray-dim ml-8 space-y-4">
              {records.map((r) => (
                <li key={r.id} className="pl-6 relative">
                  <span className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-copper" />
                  <p className="text-sm text-bone">{formatDate(r.date)}</p>
                  <p className="text-xs text-wgray mt-1">
                    {r.weightKg} kg · workouts {r.workoutCompletionPct}% · nutrition {r.nutritionAdherencePct}%
                  </p>
                  {r.notes && <p className="text-xs text-wgray-dim mt-1">{r.notes}</p>}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}

      <Drawer open={adding} onClose={() => setAdding(false)} title="New check-in">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Target (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.targetWeightKg}
                onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                className="input-dark"
              />
            </div>
          </div>
          <div>
            <label className="label-dark">Height (cm, optional)</label>
            <input
              type="number"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: e.target.value.replace(/\D/g, "") })}
              className="input-dark"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Workout completion %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.workoutCompletionPct}
                onChange={(e) => setForm({ ...form, workoutCompletionPct: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Nutrition adherence %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.nutritionAdherencePct}
                onChange={(e) => setForm({ ...form, nutritionAdherencePct: e.target.value })}
                className="input-dark"
              />
            </div>
          </div>
          <div>
            <label className="label-dark">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-dark" />
          </div>
          <button onClick={submit} className="btn-primary w-full">
            Save Check-in
          </button>
        </div>
      </Drawer>
    </div>
  );
}
