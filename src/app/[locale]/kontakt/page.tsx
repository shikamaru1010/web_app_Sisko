"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isEn = locale === "en";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center gradient-border-bottom">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-glow sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl glass-card p-6">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{t("phone")}</h3>
                    <div className="flex flex-col gap-1">
                      {RESTAURANT.phones.map((phone) => (
                        <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="text-text-muted hover:text-accent transition-colors">
                          {phone}
                        </a>
                      ))}
                    </div>
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
              <div className="flex flex-col items-center justify-center rounded-2xl glass-card p-8 text-center">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark">
                  {isEn ? "Message sent!" : "Порука послата!"}
                </h3>
                <p className="mt-2 text-text-muted">
                  {isEn ? "We will get back to you as soon as possible." : "Одговорићемо вам у најкраћем року."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl glass-card p-6">
                <div className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-900/20 px-4 py-3 text-sm text-red-400">
                      <AlertCircle size={16} />
                      {isEn ? "Failed to send message. Please try again." : "Слање поруке није успело. Покушајте поново."}
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formName")}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-text-dark input-premium"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formEmail")}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-text-dark input-premium"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-dark">{t("formMessage")}</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full resize-none rounded-lg border border-charcoal-light bg-charcoal-light px-4 py-2.5 text-sm text-text-dark transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="shimmer-btn flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98] disabled:opacity-60"
                  >
                    <Send size={18} />
                    {loading
                      ? (isEn ? "Sending..." : "Слање...")
                      : t("formSubmit")}
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
