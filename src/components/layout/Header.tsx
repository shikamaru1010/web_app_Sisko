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
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-text-light"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 font-[family-name:var(--font-heading)] text-xl font-black text-accent">
              Ш
            </span>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold leading-tight text-accent">
                Месара Шишко
              </span>
              <span className="text-[10px] tracking-widest text-wood-light uppercase">
                Чајетина
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-light/80 transition-colors hover:bg-wood-dark/50 hover:text-accent"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Cart button */}
            <Link
              href={`/${locale}/korpa`}
              className="relative rounded-lg p-2 text-text-light transition-colors hover:bg-wood-dark/50"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-text-light md:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-wood-dark/30 bg-charcoal md:hidden">
          <nav className="flex flex-col px-4 py-3">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-text-light/80 transition-colors hover:bg-wood-dark/50 hover:text-accent"
            >
              {t("home")}
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-text-light/80 transition-colors hover:bg-wood-dark/50 hover:text-accent"
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
