"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

const LINKS = [
  { href: "/programs", key: "nav_programs" },
  { href: "/coaching", key: "nav_coaching" },
  { href: "/transformations", key: "nav_transformations" },
  { href: "/about", key: "nav_about" },
  { href: "/contact", key: "nav_contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled || open
          ? "bg-graphite/90 backdrop-blur-md border-b border-wgray-dim/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Belghamdi Coaching"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="font-display font-semibold tracking-[0.22em] uppercase text-sm text-bone">
            Belghamdi<span className="text-copper">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-wgray hover:text-bone transition-colors duration-200 font-medium"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-wgray hover:text-copper transition-colors"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {lang === "en" ? "AR" : "EN"}
          </button>
          <Link
            href="/cart"
            className="relative text-wgray hover:text-bone transition-colors"
            aria-label={t("nav_cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-copper text-graphite text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="border border-wgray-dim px-4 py-2 text-xs font-display uppercase tracking-widest text-bone hover:border-copper hover:text-copper transition-colors"
          >
            {t("nav_login")}
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-4">
          <Link href="/cart" className="text-wgray relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-copper text-graphite text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-bone"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-graphite/95 backdrop-blur-md border-t border-wgray-dim/30 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base text-wgray hover:text-bone font-medium"
                >
                  {t(l.key)}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-base text-copper font-medium"
              >
                {t("nav_login")}
              </Link>
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-wgray"
              >
                <Globe className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
