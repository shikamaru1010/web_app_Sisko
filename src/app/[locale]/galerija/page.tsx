"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  src: string;
  alt: string;
  category: "food" | "interior";
};

const images: GalleryImage[] = [
  { src: "/images/punRostilj.jpg", alt: "Pun roštilj", category: "food" },
  { src: "/images/punRostilj3.jpg", alt: "Roštilj", category: "food" },
  { src: "/images/punRostilj4.jpg", alt: "Roštilj specijaliteti", category: "food" },
  { src: "/images/punRostiljPticja.jpg", alt: "Roštilj iz ptičje perspektive", category: "food" },
  { src: "/images/punRostilj2Pticja.jpg", alt: "Pun roštilj odozgo", category: "food" },
  { src: "/images/pljekaOdKilo.jpg", alt: "Pljeskavica od kilo", category: "food" },
  { src: "/images/pljekaULepinji.jpg", alt: "Pljeskavica u lepinji", category: "food" },
  { src: "/images/cevapiULepinji.jpg", alt: "Ćevapi u lepinji", category: "food" },
  { src: "/images/kompletLepinja.jpg", alt: "Komplet lepinja", category: "food" },
  { src: "/images/rolovaniCevULepinji.jpg", alt: "Rolovani ćevapi", category: "food" },
  { src: "/images/rolovanoBeloULepinji.jpg", alt: "Rolovano belo u lepinji", category: "food" },
  { src: "/images/pileceBeloULepinji.jpg", alt: "Pileće belo u lepinji", category: "food" },
  { src: "/images/vratLepinja.jpg", alt: "Vrat u lepinji", category: "food" },
  { src: "/images/rositljLepinja.jpg", alt: "Roštilj lepinja", category: "food" },
  { src: "/images/velikaPljeka.jpg", alt: "Velika pljeskavica", category: "food" },
  { src: "/images/4Ovala.jpg", alt: "Četiri ovala", category: "food" },
  { src: "/images/ovalPomfLuk.jpg", alt: "Oval sa pomfritom i lukom", category: "food" },
  { src: "/images/ovalSmajli.jpg", alt: "Oval smajli", category: "food" },
  { src: "/images/pomfOvalLukPticja.jpg", alt: "Pomfrit i oval", category: "food" },
  { src: "/images/kompletLepinjaWhiteBackground.jpg", alt: "Komplet lepinja", category: "food" },
  { src: "/images/Izlog.jpg", alt: "Izlog mesare", category: "interior" },
  { src: "/images/izlogDesno.jpg", alt: "Izlog desno", category: "interior" },
  { src: "/images/izlogLevo.jpg", alt: "Izlog levo", category: "interior" },
];

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [filter, setFilter] = useState<"all" | "food" | "interior">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  const closeLightbox = () => setLightbox(null);

  const navigate = (direction: number) => {
    if (lightbox === null) return;
    const newIndex = lightbox + direction;
    if (newIndex >= 0 && newIndex < filtered.length) {
      setLightbox(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filter */}
        <div className="mb-8 flex justify-center gap-2">
          {(["all", "food", "interior"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-accent text-white shadow-md"
                  : "bg-white text-text-dark hover:bg-cream-dark"
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <div
              key={img.src}
              className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm"
              onClick={() => setLightbox(i)}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 transition-colors group-hover:bg-charcoal/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {lightbox < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={800}
              className="max-h-[85vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
