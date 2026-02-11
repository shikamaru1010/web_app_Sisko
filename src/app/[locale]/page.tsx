"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Flame, Leaf, Award, MapPin, Clock, ArrowRight } from "lucide-react";
import { menuData } from "@/data/menu";
import { RESTAURANT } from "@/lib/constants";

const popularItems = ["mesano-sveze", "pljeskavica", "cevapi", "komplet-lepinja"];

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const isEn = locale === "en";

  const popular = menuData
    .flatMap((cat) => cat.items)
    .filter((item) => popularItems.includes(item.id));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <Image
            src="/images/punRostilj.jpg"
            alt="Roštilj"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:pb-24 sm:pt-28 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex justify-center">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 font-[family-name:var(--font-heading)] text-5xl font-black text-accent sm:h-24 sm:w-24 sm:text-6xl">
              Ш
            </span>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-text-light sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-light/70 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/meni`}
              className="flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-accent-hover hover:shadow-xl active:scale-95"
            >
              {t("ctaMenu")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/korpa`}
              className="flex items-center gap-2 rounded-full border-2 border-text-light/30 px-8 py-3.5 text-base font-semibold text-text-light transition-all hover:border-accent hover:text-accent"
            >
              {t("ctaOrder")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
            {t("whyUs")}
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <Flame className="text-accent" size={32} />,
                title: t("freshMeat"),
                desc: t("freshMeatDesc"),
              },
              {
                icon: <Award className="text-secondary" size={32} />,
                title: t("tradition"),
                desc: t("traditionDesc"),
              },
              {
                icon: <Leaf className="text-primary" size={32} />,
                title: t("quality"),
                desc: t("qualityDesc"),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex justify-center">{card.icon}</div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-text-dark">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular items */}
      <section className="bg-cream-dark py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
            {t("popularItems")}
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={isEn ? item.nameEn : item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-cream-dark">
                      <span className="text-5xl opacity-40">🍖</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-text-dark">
                    {isEn ? item.nameEn : item.name}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-accent">
                    {(item.price || item.options?.[0]?.price || 0).toLocaleString("sr-RS")}
                    <span className="text-sm font-normal text-text-muted">
                      {" "}
                      {isEn ? "RSD" : "дин"}
                      {item.unit && `/${isEn ? item.unitEn : item.unit}`}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/meni`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark active:scale-95"
            >
              {t("viewFullMenu")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Find us */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
            {t("findUs")}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-accent" />
              <span className="text-text-muted">
                {isEn ? RESTAURANT.address.en : RESTAURANT.address.sr}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-accent" />
              <div className="text-left">
                <span className="block text-sm font-semibold text-text-dark">
                  {t("workingHours")}
                </span>
                <span className="text-sm text-text-muted">
                  {isEn ? RESTAURANT.workingHours.en : RESTAURANT.workingHours.sr}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href={`/${locale}/lokacija`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
            >
              <MapPin size={18} />
              {isEn ? "View on map" : "Погледај на мапи"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
