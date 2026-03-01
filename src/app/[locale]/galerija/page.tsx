"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryCategory = "izgledObjekta" | "jelanaKilo" | "jelauLepinji" | "proces" | "specijal";

type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
};

const images: GalleryImage[] = [
  // izgledObjekta — 8
  { src: "/images/izgledObjekta/Izlog.jpg", alt: "Izlog mesare", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/izlogDesno.jpg", alt: "Izlog desno", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/izlogLevo.jpg", alt: "Izlog levo", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/unutra.jpg", alt: "Unutrašnjost", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/astal.jpg", alt: "Astal", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/teras.jpg", alt: "Terasa", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/terasa.jpg", alt: "Terasa spolja", category: "izgledObjekta" },
  { src: "/images/izgledObjekta/terasa2.jpg", alt: "Terasa pogled", category: "izgledObjekta" },
  // jelanaKilo — 12
  { src: "/images/jelanaKilo/belaVesalica.jpg", alt: "Bela vešalica", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/cevapi.jpg", alt: "Ćevapi", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/dimljeniSvinjskiVrat.jpg", alt: "Dimljeni svinjski vrat", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/hamburskaSlanina.jpg", alt: "Hamburška slanina", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/kobasica.jpg", alt: "Kobasica", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/pileciBatak.jpg", alt: "Pileći batak", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/pileciFile.jpg", alt: "Pileći file", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/rolovaniCevapi.jpg", alt: "Rolovani ćevapi", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/rolovanoPileceBelo.jpg", alt: "Rolovano pileće belo", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskaSnicla.jpg", alt: "Svinjska šnicla", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskiRaznjic.jpg", alt: "Svinjski ražnjić", category: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskiVrat.jpg", alt: "Svinjski vrat", category: "jelanaKilo" },
  // jelauLepinji — 10
  { src: "/images/jelauLepinji/cevapiULepinji.jpg", alt: "Ćevapi u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/cevapiULepinjiUradjena.png", alt: "Ćevapi u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/kompletLepinjaWhiteBackground.jpg", alt: "Komplet lepinja", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/kompletLepinjaWhiteBackgroundEditovana.jpg", alt: "Komplet lepinja", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/kompletUradjena.png", alt: "Komplet lepinja", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/pileceBeloULepinji.jpg", alt: "Pileće belo u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/pljekaULepinji.jpg", alt: "Pljeskavica u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/pljekauLepinjiDrveniStil.png", alt: "Pljeskavica u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/rolovaniCevULepinji.jpg", alt: "Rolovani ćevapi u lepinji", category: "jelauLepinji" },
  { src: "/images/jelauLepinji/rolovanoBeloULepinji.jpg", alt: "Rolovano belo u lepinji", category: "jelauLepinji" },
  // proces — 9
  { src: "/images/proces/punRostilj.jpg", alt: "Pun roštilj", category: "proces" },
  { src: "/images/proces/punRostilj2Pticja.jpg", alt: "Roštilj odozgo", category: "proces" },
  { src: "/images/proces/punRostilj3.jpg", alt: "Roštilj", category: "proces" },
  { src: "/images/proces/punRostilj4.jpg", alt: "Roštilj specijaliteti", category: "proces" },
  { src: "/images/proces/punRostiljPticja.jpg", alt: "Roštilj iz ptičje perspektive", category: "proces" },
  { src: "/images/proces/kobajanaRostilju.jpg", alt: "Kobasice na roštilju", category: "proces" },
  { src: "/images/proces/velikaPljeka.jpg", alt: "Velika pljeskavica", category: "proces" },
  { src: "/images/proces/vratLepinja.jpg", alt: "Vrat u lepinji", category: "proces" },
  { src: "/images/kobajePriprema.jpg", alt: "Priprema kobasica", category: "proces" },
  // specijal — 7
  { src: "/images/specijal/4Ovala.jpg", alt: "Četiri ovala", category: "specijal" },
  { src: "/images/specijal/ovalPomfLuk.jpg", alt: "Oval sa pomfritom i lukom", category: "specijal" },
  { src: "/images/specijal/ovalSmajli.jpg", alt: "Oval smajli", category: "specijal" },
  { src: "/images/specijal/pljekaKackavalj.jpg", alt: "Pljeskavica sa kačkavaljem", category: "specijal" },
  { src: "/images/specijal/pljekaOdKilo.jpg", alt: "Pljeskavica od kilo", category: "specijal" },
  { src: "/images/specijal/pomfOvalLukPticja.jpg", alt: "Pomfrit i oval odozgo", category: "specijal" },
  { src: "/images/specijal/rositljLepinja.jpg", alt: "Roštilj lepinja", category: "specijal" },
];

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
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
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center gradient-border-bottom">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-glow sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {(["all", "izgledObjekta", "jelanaKilo", "jelauLepinji", "proces", "specijal"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
                filter === cat
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-charcoal-light text-text-dark hover:bg-charcoal hover:shadow-sm"
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
              className="gallery-img-hover group relative cursor-pointer overflow-hidden rounded-xl ring-1 ring-accent/10 shadow-sm transition-all duration-300 hover:ring-accent/25 hover:shadow-lg hover:shadow-accent/5"
              onClick={() => setLightbox(i)}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
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
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
          >
            <X size={24} />
          </button>

          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {lightbox < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            {lightbox + 1} / {filtered.length}
          </div>

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
