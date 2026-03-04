"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, Building2 } from "lucide-react";

type FoodSubcategory = "all-food" | "jelanaKilo" | "jelauLepinji" | "proces" | "specijal";
type InteriorSubcategory = "all-interior";
type GallerySection = "jela" | "enterijer";

type GalleryImage = {
  src: string;
  alt: string;
  section: GallerySection;
  subcategory: FoodSubcategory | InteriorSubcategory;
};

const images: GalleryImage[] = [
  // ===== JELA (Food) =====

  // jelanaKilo — Meat by kilo
  { src: "/images/jelanaKilo/belaVesalica.jpg", alt: "Bela vesalica", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/cevapi.png", alt: "Cevapi", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/dimljeniSvinjskiVrat.jpg", alt: "Dimljeni svinjski vrat", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/hamburskaSlanina.jpg", alt: "Hamburska slanina", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/kobasica.jpg", alt: "Kobasica", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/pileciBatak.jpg", alt: "Pileci batak", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/pileciFile.jpg", alt: "Pileci file", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/rolovaniCevapi.jpg", alt: "Rolovani cevapi", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/rolovanoPileceBelo.jpg", alt: "Rolovano pilece belo", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskaSnicla.jpg", alt: "Svinjska snicla", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskiRaznjic.jpg", alt: "Svinjski raznjic", section: "jela", subcategory: "jelanaKilo" },
  { src: "/images/jelanaKilo/svinjskiVrat.jpg", alt: "Svinjski vrat", section: "jela", subcategory: "jelanaKilo" },

  // jelauLepinji — In bread
  { src: "/images/jelauLepinji/cevapi.png", alt: "Cevapi u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/pljeskavica.png", alt: "Pljeskavica u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/pileceBelo.png", alt: "Pilece belo u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/pileciFile.png", alt: "Pileci file u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/rolovaniCevapi.png", alt: "Rolovani cevapi u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/rolovanoBelo.png", alt: "Rolovano belo u lepinji", section: "jela", subcategory: "jelauLepinji" },
  { src: "/images/jelauLepinji/kompletLepinja.png", alt: "Komplet lepinja", section: "jela", subcategory: "jelauLepinji" },

  // proces — On the grill
  { src: "/images/proces/punRostilj.jpg", alt: "Pun rostilj", section: "jela", subcategory: "proces" },
  { src: "/images/proces/punRostilj2Pticja.jpg", alt: "Rostilj odozgo", section: "jela", subcategory: "proces" },
  { src: "/images/proces/punRostilj3.jpg", alt: "Rostilj", section: "jela", subcategory: "proces" },
  { src: "/images/proces/punRostilj4.jpg", alt: "Rostilj specijaliteti", section: "jela", subcategory: "proces" },
  { src: "/images/proces/punRostiljPticja.jpg", alt: "Rostilj iz pticje perspektive", section: "jela", subcategory: "proces" },
  { src: "/images/proces/kobajanaRostilju.jpg", alt: "Kobasice na rostilju", section: "jela", subcategory: "proces" },
  { src: "/images/proces/kobajePriprema.jpg", alt: "Priprema kobasica", section: "jela", subcategory: "proces" },
  { src: "/images/proces/velikaPljeka.jpg", alt: "Velika pljeskavica", section: "jela", subcategory: "proces" },
  { src: "/images/proces/vratLepinja.jpg", alt: "Vrat u lepinji", section: "jela", subcategory: "proces" },

  // specijal — Specials
  { src: "/images/specijal/4Ovala.jpg", alt: "Cetiri ovala", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/ovalPomfLuk.jpg", alt: "Oval sa pomfritom i lukom", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/ovalSmajli.jpg", alt: "Oval smajli", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/pljekaKackavalj.jpg", alt: "Pljeskavica sa kackavaljem", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/pljekaOdKilo.jpg", alt: "Pljeskavica od kilo", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/pomfOvalLukPticja.jpg", alt: "Pomfrit i oval odozgo", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/pomf_na_ovalu.png", alt: "Pomfrit na ovalu", section: "jela", subcategory: "specijal" },
  { src: "/images/specijal/rositljLepinja.jpg", alt: "Rostilj lepinja", section: "jela", subcategory: "specijal" },

  // ===== ENTERIJER (Interior/Exterior) =====
  { src: "/images/izgledObjekta/Izlog.jpg", alt: "Izlog mesare", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/izlogDesno.jpg", alt: "Izlog desno", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/izlogLevo.jpg", alt: "Izlog levo", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/unutra.jpg", alt: "Unutrasnjost", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/astal.jpg", alt: "Astal", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/teras.jpg", alt: "Terasa", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/terasa.jpg", alt: "Terasa spolja", section: "enterijer", subcategory: "all-interior" },
  { src: "/images/izgledObjekta/terasa2.jpg", alt: "Terasa pogled", section: "enterijer", subcategory: "all-interior" },
];

const foodSubcategories: FoodSubcategory[] = ["all-food", "jelanaKilo", "jelauLepinji", "proces", "specijal"];

const foodCount = images.filter((img) => img.section === "jela").length;
const interiorCount = images.filter((img) => img.section === "enterijer").length;

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [section, setSection] = useState<GallerySection>("jela");
  const [foodFilter, setFoodFilter] = useState<FoodSubcategory>("all-food");
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Get images for current section
  const sectionImages = images.filter((img) => img.section === section);

  // Apply sub-filter for food section
  const filtered =
    section === "jela" && foodFilter !== "all-food"
      ? sectionImages.filter((img) => img.subcategory === foodFilter)
      : sectionImages;

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback(
    (direction: number) => {
      setLightbox((prev) => {
        if (prev === null) return null;
        const newIndex = prev + direction;
        if (newIndex >= 0 && newIndex < filtered.length) return newIndex;
        return prev;
      });
    },
    [filtered.length]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, navigate, closeLightbox]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center gradient-border-bottom">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-glow sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Section tabs */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full bg-charcoal-light p-1 shadow-sm">
            <button
              onClick={() => { setSection("jela"); setFoodFilter("all-food"); }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                section === "jela"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-text-dark hover:bg-charcoal hover:text-text-light"
              }`}
            >
              <UtensilsCrossed size={16} />
              {t("sectionFood")}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                section === "jela" ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
              }`}>
                {foodCount}
              </span>
            </button>
            <button
              onClick={() => { setSection("enterijer"); setFoodFilter("all-food"); }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                section === "enterijer"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-text-dark hover:bg-charcoal hover:text-text-light"
              }`}
            >
              <Building2 size={16} />
              {t("sectionInterior")}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                section === "enterijer" ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
              }`}>
                {interiorCount}
              </span>
            </button>
          </div>
        </div>

        {/* Food subcategory filters (only shown in food section) */}
        {section === "jela" && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {foodSubcategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFoodFilter(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
                  foodFilter === cat
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-charcoal-light text-text-dark hover:bg-charcoal hover:text-text-light hover:shadow-sm"
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        )}

        {/* Section description + image count */}
        <p className="mb-4 text-center text-xs text-text-muted">
          {filtered.length} {t("photoCount")}
          {section === "jela" && foodFilter !== "all-food" && (
            <span> &middot; {t(foodFilter)}</span>
          )}
        </p>

        {/* Grid — food gets 2-col on mobile, interior gets larger tiles since fewer images */}
        <div className={`grid gap-3 sm:gap-4 ${
          section === "enterijer"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        }`}>
          {filtered.map((img, i) => (
            <div
              key={img.src}
              className="gallery-img-hover group relative cursor-pointer overflow-hidden rounded-xl ring-1 ring-accent/10 shadow-sm transition-all duration-300 hover:ring-accent/25 hover:shadow-lg hover:shadow-accent/5"
              onClick={() => setLightbox(i)}
            >
              <div className={`relative ${
                section === "enterijer" ? "aspect-[4/3]" : "aspect-square"
              }`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={
                    section === "enterijer"
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  }
                />
              </div>
              {/* Image label overlay on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                <span className="text-xs font-medium text-white/90">{img.alt}</span>
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
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {lightbox < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image counter + caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-white/60">
              {filtered[lightbox].alt}
            </span>
            <span className="rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              {lightbox + 1} / {filtered.length}
            </span>
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
