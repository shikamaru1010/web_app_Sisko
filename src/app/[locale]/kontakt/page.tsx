"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isEn = locale === "en";
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("phone")}</h3>
                    <a href={`tel:${RESTAURANT.phone}`} className="text-text-muted hover:text-accent transition-colors">
                      {RESTAURANT.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("email")}</h3>
                    <a href={`mailto:${RESTAURANT.email}`} className="text-text-muted hover:text-accent transition-colors">
                      {RESTAURANT.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("address")}</h3>
                    <p className="text-text-muted">{isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <Clock size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("workingHours")}</h3>
                    <p className="text-text-muted">{isEn ? RESTAURANT.workingHours.en : RESTAURANT.workingHours.sr}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark">
                  {isEn ? "Message sent!" : "Порука послата!"}
                </h3>
                <p className="mt-2 text-text-muted">
                  {isEn ? "We will get back to you as soon as possible." : "Одговоричемо вам у најкраћем року."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formName")}</label>
                    <input type="text" required className="w-full rounded-lg border border-wood-light/30 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formEmail")}</label>
                    <input type="email" required className="w-full rounded-lg border border-wood-light/30 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formMessage")}</label>
                    <textarea required rows={5} className="w-full resize-none rounded-lg border border-wood-light/30 px-4 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98]">
                    <Send size={18} />
                    {t("formSubmit")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
