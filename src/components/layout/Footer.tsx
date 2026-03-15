"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <footer className="border-t border-wood-dark/20 bg-charcoal text-text-light">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 font-[family-name:var(--font-heading)] text-2xl font-black text-accent ring-1 ring-accent/20">
                Ш
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-accent">
                  Месара Шишко
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-wood-light/80 uppercase">
                  Чајетина
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-light/50">
              {isEn
                ? "The finest grill on Zlatibor. Fresh meat, traditional taste, family atmosphere."
                : "Најбољи роштиљ на Златибору. Свеже месо, традиционални укус, породична атмосфера."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.15em] text-wood-light/90">
              {isEn ? "Quick Links" : "Брзи линкови"}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href={`/${locale}/meni`}
                className="text-sm text-text-light/50 transition-colors hover:text-accent"
              >
                {t("nav.menu")}
              </Link>
              <Link
                href={`/${locale}/o-nama`}
                className="text-sm text-text-light/50 transition-colors hover:text-accent"
              >
                {t("nav.about")}
              </Link>
              <Link
                href={`/${locale}/galerija`}
                className="text-sm text-text-light/50 transition-colors hover:text-accent"
              >
                {t("nav.gallery")}
              </Link>
              <Link
                href={`/${locale}/kontakt`}
                className="text-sm text-text-light/50 transition-colors hover:text-accent"
              >
                {t("nav.contact")}
              </Link>
              <Link
                href={`/${locale}/zabava`}
                className="text-sm text-text-light/50 transition-colors hover:text-accent"
              >
                {t("nav.fun")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.15em] text-wood-light/90">
              {t("contact.title")}
            </h4>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-sm text-text-light/50">
                <MapPin size={15} className="shrink-0 text-accent/70" />
                <span>{isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/50">
                <Phone size={15} className="shrink-0 text-accent/70" />
                <span>{RESTAURANT.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/50">
                <Mail size={15} className="shrink-0 text-accent/70" />
                <span>{RESTAURANT.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/50">
                <Clock size={15} className="shrink-0 text-accent/70" />
                <span>
                  {isEn
                    ? RESTAURANT.workingHours.en
                    : RESTAURANT.workingHours.sr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-wood-dark/20 pt-6 text-center">
          <p className="text-xs tracking-wide text-text-light/30">
            &copy; {new Date().getFullYear()} {isEn ? RESTAURANT.fullName.en : RESTAURANT.fullName.sr}.{" "}
            {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
