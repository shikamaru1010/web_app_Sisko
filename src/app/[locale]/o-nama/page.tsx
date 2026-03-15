"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Flame, Heart, TreePine } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  const sections = [
    {
      icon: <Heart className="text-ember" size={24} />,
      title: t("story"),
      text: t("storyText"),
      image: "/images/Izlog.jpg",
    },
    {
      icon: <Flame className="text-accent" size={24} />,
      title: t("specialties"),
      text: t("specialtiesText"),
      image: "/images/punRostilj3.jpg",
    },
    {
      icon: <TreePine className="text-primary" size={24} />,
      title: t("atmosphere"),
      text: t("atmosphereText"),
      image: "/images/izlogLevo.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="page-header px-4 pb-12 pt-10 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-shadow-subtle sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/50">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`mb-16 last:mb-0 flex flex-col gap-8 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } md:items-center`}
          >
            <div className="relative h-64 overflow-hidden rounded-2xl border border-wood-light/15 shadow-md md:h-72 md:w-1/2">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-dark">
                  {section.icon}
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
                  {section.title}
                </h2>
              </div>
              <p className="text-[15px] leading-relaxed text-text-muted">
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
