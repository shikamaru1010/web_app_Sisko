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
      <div className="page-header px-4 pb-12 pt-10 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-shadow-subtle sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/50">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="card-premium rounded-2xl p-7">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/8">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("phone")}</h3>
                    <a href={`tel:${RESTAURANT.phone}`} className="text-text-muted hover:text-accent transition-colors">
                      {RESTAURANT.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/8">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("email")}</h3>
                    <a href={`mailto:${RESTAURANT.email}`} className="text-text-muted hover:text-accent transition-colors">
                      {RESTAURANT.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/8">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("address")}</h3>
                    <p className="text-text-muted">{isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/8">
                    <Clock size={18} className="text-accent" />
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
              <div className="flex flex-col items-center justify-center card-premium rounded-2xl p-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark">
                  {isEn ? "Message sent!" : "Порука послата!"}
                </h3>
                <p className="mt-2 text-text-muted">
                  {isEn ? "We will get back to you as soon as possible." : "Одговоричемо вам у најкраћем року."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-premium rounded-2xl p-7">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formName")}</label>
                    <input type="text" required className="w-full rounded-lg border border-wood-light/20 px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formEmail")}</label>
                    <input type="email" required className="w-full rounded-lg border border-wood-light/20 px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formMessage")}</label>
                    <textarea required rows={5} className="w-full resize-none rounded-lg border border-wood-light/20 px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" />
                  </div>
                  <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-[15px] text-white transition-all hover:bg-accent-hover active:scale-[0.98]">
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
