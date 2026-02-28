"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flame, Leaf, Award, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { menuData } from "@/data/menu";
import { RESTAURANT } from "@/lib/constants";

const EmberParticles = dynamic(() => import("@/components/effects/EmberParticles"), { ssr: false });

const popularItems = ["mesano-sveze", "pljeskavica", "cevapi", "komplet-lepinja"];

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const isEn = locale === "en";
  const prefersReduced = useReducedMotion();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const popular = menuData
    .flatMap((cat) => cat.items)
    .filter((item) => popularItems.includes(item.id));

  return (
    <div className="min-h-screen">
      {/* ===== CINEMATIC HERO ===== */}
      <section className="relative overflow-hidden bg-charcoal">
        {/* Layer 1: Background image with Ken Burns */}
        <div className="absolute inset-0">
          <Image
            src="/images/4ovalaDrveniStil.png"
            alt={isEn ? "Grilled meat on traditional grill" : "Месо на роштиљу"}
            fill
            className="object-cover object-center opacity-40 animate-ken-burns"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-charcoal/70 to-charcoal/40" />
        </div>

        {/* Layer 2: Smoke/ember overlay */}
        <div className="smoke-overlay" />

        {/* Layer 3: Ember particles — deferred 1.5s to avoid blocking LCP */}
        {showParticles && <EmberParticles />}

        {/* Layer 4: Content with staggered entrance */}
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="fire-glow rounded-2xl">
              <Image
                src="/images/logoMesara.png"
                alt={isEn ? "Grill Butcher Shop Šiško logo" : "Лого Шишко роштиљ-месара"}
                width={400}
                height={140}
                className="h-32 w-auto sm:h-44 brightness-110"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.6, delay: 0.05 }}
            className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-text-light sm:text-5xl lg:text-6xl"
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base text-text-light/70 sm:text-lg"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/meni"
              className="flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-accent-hover hover:shadow-xl active:scale-95 fire-glow"
            >
              {t("ctaMenu")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/korpa"
              className="flex items-center gap-2 rounded-full border-2 border-text-light/30 px-8 py-3.5 text-base font-semibold text-text-light transition-all hover:border-accent hover:text-accent"
            >
              {t("ctaOrder")}
            </Link>
          </motion.div>
        </div>

        {/* Layer 5: Bottom fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ===== WHY US ===== */}
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
                icon: <Award className="text-wood-light" size={32} />,
                title: t("tradition"),
                desc: t("traditionDesc"),
              },
              {
                icon: <Leaf className="text-secondary" size={32} />,
                title: t("quality"),
                desc: t("qualityDesc"),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-xl bg-accent/10 p-3">
                    {card.icon}
                  </div>
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

      {/* ===== POPULAR ITEMS ===== */}
      <section className="bg-cream-dark py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark sm:text-3xl">
            {t("popularItems")}
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl glass-card"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={isEn ? item.nameEn : item.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-cream-dark">
                      <span className="text-5xl opacity-40" aria-hidden="true">🍖</span>
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
              href="/meni"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-all hover:bg-accent-hover active:scale-95"
            >
              {t("viewFullMenu")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FIND US ===== */}
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
              href="/lokacija"
              className="inline-flex items-center gap-2 rounded-full border-2 border-accent px-6 py-3 font-semibold text-accent transition-all hover:bg-accent hover:text-white"
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
