"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Navigation, Car } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function LocationPage() {
  const t = useTranslations("location");
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.5!2d${RESTAURANT.coordinates.lng}!3d${RESTAURANT.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1s${locale}!2srs!4v1`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
            className="w-full"
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Navigation size={24} className="text-accent" />
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text-dark">{t("directions")}</h2>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">{t("directionsText")}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-accent" />
              <span className="font-medium text-text-dark">{isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <Car size={24} className="text-accent" />
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text-dark">{t("parking")}</h2>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">{t("parkingText")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
