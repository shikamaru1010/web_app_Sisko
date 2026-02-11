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
      image: "/images/Izlog.jpg",
    },
    {
      icon: <Flame className="text-accent" size={28} />,
      title: t("specialties"),
      text: t("specialtiesText"),
      image: "/images/punRostilj3.jpg",
    },
    {
      icon: <TreePine className="text-primary" size={28} />,
      title: t("atmosphere"),
      text: t("atmosphereText"),
      image: "/images/izlogLevo.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`mb-12 flex flex-col gap-6 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } md:items-center`}
          >
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg md:h-72 md:w-1/2">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="md:w-1/2">
              <div className="mb-3 flex items-center gap-3">
                {section.icon}
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
                  {section.title}
                </h2>
              </div>
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
