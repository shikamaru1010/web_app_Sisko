"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Flame, Heart, TreePine } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  const sections = [
    {
      icon: <Heart className="text-ember" size={28} />,
      title: t("story"),
      text: t("storyText"),
      image: "/images/unutra.jpg",
    },
    {
      icon: <Flame className="text-accent" size={28} />,
      title: t("specialties"),
      text: t("specialtiesText"),
      image: "/images/pljekaKackavalj.jpg",
    },
    {
      icon: <TreePine className="text-primary" size={28} />,
      title: t("atmosphere"),
      text: t("atmosphereText"),
      image: "/images/teras.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center gradient-border-bottom">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-glow sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`mb-16 flex flex-col gap-8 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } md:items-center`}
          >
            <div className="group relative h-64 overflow-hidden rounded-2xl shadow-lg ring-1 ring-accent/10 md:h-72 md:w-1/2">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="md:w-1/2">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2 shadow-sm shadow-accent/5">
                  {section.icon}
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
                  {section.title}
                </h2>
              </div>
              <div className="mb-4 h-px w-16 bg-gradient-to-r from-accent/40 to-transparent" />
              <p className="text-base leading-relaxed text-text-muted">
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
