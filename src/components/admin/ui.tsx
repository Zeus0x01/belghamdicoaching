"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export const STATUS_STYLES: Record<string, string> = {
  new: "bg-copper/15 text-copper border-copper/40",
  contacted: "bg-bone/10 text-bone border-bone/30",
  qualified: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  converted: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  lost: "bg-red-400/10 text-red-300 border-red-400/30",
  active: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  pending: "bg-yellow-400/10 text-yellow-300 border-yellow-400/30",
  expired: "bg-wgray/20 text-wgray border-wgray/30",
  cancelled: "bg-red-400/10 text-red-300 border-red-400/30",
  "on-hold": "bg-orange-400/10 text-orange-300 border-orange-400/30",
  paid: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  refunded: "bg-orange-400/10 text-orange-300 border-orange-400/30",
  fulfilled: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  unfulfilled: "bg-wgray/20 text-wgray border-wgray/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-[10px] font-display uppercase tracking-widest border px-2.5 py-1 ${
        STATUS_STYLES[status] ?? "bg-wgray/20 text-wgray border-wgray/30"
      }`}
    >
      {status}
    </span>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute right-0 top-0 h-full w-full ${wide ? "max-w-2xl" : "max-w-lg"} bg-obsidian border-l border-wgray-dim/60 overflow-y-auto`}
          >
            <div className="sticky top-0 bg-obsidian border-b border-wgray-dim/60 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="font-display font-semibold text-lg text-bone">{title}</h2>
              <button onClick={onClose} className="text-wgray hover:text-bone" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-obsidian border border-wgray-dim/60 max-w-sm w-full p-8"
          >
            <h3 className="font-display font-semibold text-lg text-bone">{title}</h3>
            <p className="text-sm text-wgray mt-2">{message}</p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={onCancel}
                className="flex-1 border border-wgray-dim text-wgray py-3 text-sm font-display uppercase tracking-widest hover:text-bone transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-500/80 text-white py-3 text-sm font-display uppercase tracking-widest hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
