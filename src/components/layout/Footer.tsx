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
    <footer className="bg-charcoal text-text-light">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/20 font-[family-name:var(--font-heading)] text-2xl font-black text-accent">
                Ш
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-accent">
                  Месара Шишко
                </h3>
                <p className="text-xs tracking-widest text-wood-light uppercase">
                  Чајетина
                </p>
              </div>
            </div>
            <p className="text-sm text-text-light/60 leading-relaxed">
              {isEn
                ? "The finest grill on Zlatibor. Fresh meat, traditional taste, family atmosphere."
                : "Најбољи роштиљ на Златибору. Свеже месо, традиционални укус, породична атмосфера."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-semibold text-wood-light">
              {isEn ? "Quick Links" : "Брзи линкови"}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${locale}/meni`}
                className="text-sm text-text-light/60 hover:text-accent transition-colors"
              >
                {t("nav.menu")}
              </Link>
              <Link
                href={`/${locale}/o-nama`}
                className="text-sm text-text-light/60 hover:text-accent transition-colors"
              >
                {t("nav.about")}
              </Link>
              <Link
                href={`/${locale}/galerija`}
                className="text-sm text-text-light/60 hover:text-accent transition-colors"
              >
                {t("nav.gallery")}
              </Link>
              <Link
                href={`/${locale}/kontakt`}
                className="text-sm text-text-light/60 hover:text-accent transition-colors"
              >
                {t("nav.contact")}
              </Link>
              <Link
                href={`/${locale}/zabava`}
                className="text-sm text-text-light/60 hover:text-accent transition-colors"
              >
                {t("nav.fun")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-semibold text-wood-light">
              {t("contact.title")}
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-text-light/60">
                <MapPin size={16} className="shrink-0 text-accent" />
                <span>{isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/60">
                <Phone size={16} className="shrink-0 text-accent" />
                <span>{RESTAURANT.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/60">
                <Mail size={16} className="shrink-0 text-accent" />
                <span>{RESTAURANT.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-light/60">
                <Clock size={16} className="shrink-0 text-accent" />
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
        <div className="mt-10 border-t border-wood-dark/30 pt-6 text-center">
          <p className="text-xs text-text-light/40">
            &copy; {new Date().getFullYear()} {isEn ? RESTAURANT.fullName.en : RESTAURANT.fullName.sr}.{" "}
            {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
