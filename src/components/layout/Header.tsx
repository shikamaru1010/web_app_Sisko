"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCartStore } from "@/lib/cart-store";

const navLinks = [
  { href: "/meni", key: "menu" },
  { href: "/o-nama", key: "about" },
  { href: "/galerija", key: "gallery" },
  { href: "/kontakt", key: "contact" },
  { href: "/lokacija", key: "location" },
  { href: "/zabava", key: "fun" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <header className="sticky top-0 z-50 border-b border-wood-dark/20 bg-charcoal/95 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2.5 text-text-light"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 font-[family-name:var(--font-heading)] text-xl font-black text-accent ring-1 ring-accent/20 transition-all group-hover:bg-accent/25">
              Ш
            </span>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold leading-tight text-accent">
                Месара Шишко
              </span>
              <span className="text-[10px] tracking-[0.2em] text-wood-light/80 uppercase">
                Чајетина
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium tracking-wide text-text-light/70 transition-all hover:bg-white/5 hover:text-accent"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            {/* Cart button */}
            <Link
              href={`/${locale}/korpa`}
              className="relative rounded-lg p-2 text-text-light/70 transition-all hover:bg-white/5 hover:text-text-light"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-charcoal">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-text-light/70 transition-colors hover:text-text-light md:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-wood-dark/20 bg-charcoal/98 backdrop-blur-md md:hidden">
          <nav className="flex flex-col px-4 py-2">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-text-light/70 transition-colors hover:bg-white/5 hover:text-accent"
            >
              {t("home")}
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-text-light/70 transition-colors hover:bg-white/5 hover:text-accent"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
