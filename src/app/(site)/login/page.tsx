"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

type MessageKey = "login_notice_not_connected" | "login_notice_recovery_simulated" | "";

export default function ClientLoginPage() {
  const { t } = useI18n();
  const [stage, setStage] = useState<"login" | "recovery" | "pending">("login");
  const [message, setMessage] = useState<MessageKey>("");

  const onSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("login_notice_not_connected");
    setStage("pending");
  };

  const onSubmitRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("login_notice_recovery_simulated");
  };

  return (
    <div className="pt-32 pb-28 min-h-[70vh]">
      <div className="max-w-md mx-auto px-6">
        <Reveal className="card-surface p-10">
          <p className="eyebrow mb-3">{t("nav_login")}</p>
          <h1 className="heading-lg text-3xl">
            {stage === "recovery" ? t("login_title_recovery") : t("login_title_welcome")}
          </h1>

          {stage !== "recovery" ? (
            <form className="mt-8 space-y-5" onSubmit={onSubmitLogin}>
              <div>
                <label htmlFor="email" className="label-dark">{t("login_label_email")}</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="email" type="email" required className="input-dark pl-9" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="label-dark">{t("login_label_password")}</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="password" type="password" required className="input-dark pl-9" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                {t("login_submit")} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setStage("recovery")}
                className="text-xs text-wgray hover:text-copper transition-colors block w-full text-center"
              >
                {t("login_forgot")}
              </button>

              {stage === "pending" && message && (
                <p className="text-xs leading-relaxed text-wgray border border-wgray-dim/60 p-4 bg-obsidian">
                  {t(message)}
                </p>
              )}
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmitRecovery}>
              <div>
                <label htmlFor="recover-email" className="label-dark">{t("login_label_account_email")}</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-wgray-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input id="recover-email" type="email" required className="input-dark pl-9" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                {t("login_submit_recovery")} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setStage("login")}
                className="text-xs text-wgray hover:text-copper transition-colors block w-full text-center"
              >
                {t("login_back_to_signin")}
              </button>
              {message && (
                <p className="text-xs leading-relaxed text-wgray border border-wgray-dim/60 p-4 bg-obsidian">
                  {t(message)}
                </p>
              )}
            </form>
          )}

          <p className="text-[11px] text-wgray-dim mt-8 leading-relaxed">
            {t("login_status_prefix")}{" "}
            <Link href="/programs" className="text-copper hover:underline">
              {t("login_status_cta")}
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </div>
  );
}
