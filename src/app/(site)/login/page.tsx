"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export default function ClientLoginPage() {
  const [stage, setStage] = useState<"login" | "recovery" | "pending">("login");
  const [message, setMessage] = useState("");

  const onSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(
      "Client area is not connected to Supabase Authentication yet — this experience is ready for future integration. Please contact the coach."
    );
    setStage("pending");
  };

  const onSubmitRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Recovery link simulated. An email would be dispatched when authentication is live.");
  };

  return (
    <div className="pt-32 pb-28 min-h-[70vh]">
      <div className="max-w-md mx-auto px-6">
        <Reveal className="card-surface p-10">
          <p className="eyebrow mb-3">Client Login</p>
          <h1 className="heading-lg text-3xl">
            {stage === "recovery" ? "Recover access" : "Welcome back."}
          </h1>

          {stage !== "recovery" ? (
            <form className="mt-8 space-y-5" onSubmit={onSubmitLogin}>
              <div>
                <label htmlFor="email" className="label-dark">Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="email" type="email" required className="input-dark pl-9" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="label-dark">Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="password" type="password" required className="input-dark pl-9" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                Sign In <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setStage("recovery")}
                className="text-xs text-wgray hover:text-copper transition-colors block w-full text-center"
              >
                Forgot your password?
              </button>

              {stage === "pending" && message && (
                <p className="text-xs leading-relaxed text-wgray border border-wgray-dim/60 p-4 bg-obsidian">
                  {message}
                </p>
              )}
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmitRecovery}>
              <div>
                <label htmlFor="recover-email" className="label-dark">Account email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="recover-email" type="email" required className="input-dark pl-9" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Recovery Link <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setStage("login")}
                className="text-xs text-wgray hover:text-copper transition-colors block w-full text-center"
              >
                Back to sign in
              </button>
              {message && (
                <p className="text-xs leading-relaxed text-wgray border border-wgray-dim/60 p-4 bg-obsidian">
                  {message}
                </p>
              )}
            </form>
          )}

          <p className="text-[11px] text-wgray-dim mt-8 leading-relaxed">
            Account status: this portal is prepared for Supabase Authentication integration.
            New here?{" "}
            <Link href="/programs" className="text-copper hover:underline">
              Start with a program
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </div>
  );
}
