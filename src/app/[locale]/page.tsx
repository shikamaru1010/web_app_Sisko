"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Flame, Leaf, Award, MapPin, Clock, ArrowRight } from "lucide-react";
import { menuData } from "@/data/menu";

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
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/50" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 text-center sm:pb-28 sm:pt-32 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex justify-center">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/15 font-[family-name:var(--font-heading)] text-5xl font-black text-accent ring-1 ring-accent/25 sm:h-24 sm:w-24 sm:text-6xl">
              Ш
            </span>
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-text-light text-shadow-subtle sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-light/60 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/meni`}
              className="btn-primary flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-[15px] text-white shadow-lg transition-all hover:bg-accent-hover hover:shadow-xl active:scale-95"
            >
              {t("ctaMenu")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/korpa`}
              className="flex items-center gap-2 rounded-full border border-text-light/20 px-8 py-3.5 text-[15px] font-semibold text-text-light/80 transition-all hover:border-accent/60 hover:text-accent"
            >
              {t("ctaOrder")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
              {t("whyUs")}
            </h2>
            <div className="divider-ornament mt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: <Flame className="text-accent" size={28} />,
                title: t("freshMeat"),
                desc: t("freshMeatDesc"),
              },
              {
                icon: <Award className="text-secondary" size={28} />,
                title: t("tradition"),
                desc: t("traditionDesc"),
              },
              {
                icon: <Leaf className="text-primary" size={28} />,
                title: t("quality"),
                desc: t("qualityDesc"),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="card-premium rounded-2xl p-7 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cream-dark">
                  {card.icon}
                </div>
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
      <section className="bg-cream-dark py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
              {t("popularItems")}
            </h2>
            <div className="divider-ornament mt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-wood-light/15 bg-white transition-all hover:border-wood-light/30 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={isEn ? item.nameEn : item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-cream-dark">
                      <span className="text-5xl opacity-30">🍖</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-text-dark">
                    {isEn ? item.nameEn : item.name}
                  </h3>
                  <p className="mt-1.5 text-lg font-bold text-accent">
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

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/meni`}
              className="btn-primary inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3 text-[15px] text-white transition-all hover:bg-primary-dark active:scale-95"
            >
              {t("viewFullMenu")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Find us */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
            {t("findUs")}
          </h2>
          <div className="divider-ornament mt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <MapPin size={20} className="text-accent" />
              </div>
              <span className="text-text-muted">
                {isEn ? "Čajetina, Serbia" : "Чајетина, Србија"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Clock size={20} className="text-accent" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-text-dark">
                  {t("workingHours")}
                </span>
                <span className="text-sm text-text-muted">
                  {isEn ? "Mon - Sun: 08:00 - 22:00" : "Пон - Нед: 08:00 - 22:00"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Link
              href={`/${locale}/lokacija`}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-7 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:border-primary"
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
