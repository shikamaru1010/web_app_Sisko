"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Tag } from "lucide-react";
import { menuData } from "@/data/menu";
import { combos } from "@/data/combos";
import MenuCategory from "@/components/menu/MenuCategory";
import MenuSearch from "@/components/menu/MenuSearch";
import CartButton from "@/components/menu/CartButton";
import MenuItem from "@/components/menu/MenuItem";

function latinToCyrillic(text: string): string {
  const map: [string, string][] = [
    ["lj", "љ"], ["nj", "њ"], ["dž", "џ"], ["dj", "ђ"],
    ["đ", "ђ"], ["č", "ч"], ["ć", "ћ"], ["š", "ш"], ["ž", "ж"],
    ["a","а"],["b","б"],["c","ц"],["d","д"],["e","е"],
    ["f","ф"],["g","г"],["h","х"],["i","и"],["j","ј"],
    ["k","к"],["l","л"],["m","м"],["n","н"],["o","о"],
    ["p","п"],["r","р"],["s","с"],["t","т"],["u","у"],
    ["v","в"],["z","з"],
  ];
  let result = text.toLowerCase();
  for (const [lat, cyr] of map) {
    result = result.replaceAll(lat, cyr);
  }
  return result;
}

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const locale = useLocale();
  const t = useTranslations("menu");
  const isEn = locale === "en";

  const filteredItems = useMemo(() => {
    if (!search.trim()) return null;

    const query = search.toLowerCase();
    const queryCyr = latinToCyrillic(query);
    const results = menuData.flatMap((cat) =>
      cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(queryCyr) ||
          item.nameEn.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(queryCyr) ||
          item.descriptionEn?.toLowerCase().includes(query)
      )
    );
    return results;
  }, [search]);

  const scrollToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="bg-charcoal px-4 pb-8 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Search */}
        <div className="-mt-5 mb-4">
          <MenuSearch value={search} onChange={setSearch} />
        </div>

        {/* Category quick nav */}
        {!filteredItems && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => scrollToCategory("combos")}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-4 py-2 text-xs font-medium text-accent shadow-sm transition-all hover:bg-accent hover:text-white active:scale-95"
            >
              <Tag size={12} />
              <span>{isEn ? "Combos" : "Комбо"}</span>
            </button>
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream-dark px-4 py-2 text-xs font-medium text-text-dark shadow-sm transition-all hover:bg-accent hover:text-white active:scale-95"
              >
                <span>{cat.icon}</span>
                <span>{isEn ? cat.nameEn : cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {filteredItems ? (
          <div>
            {filteredItems.length > 0 ? (
              <div className="flex flex-col gap-2 sm:gap-3">
                {filteredItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <span className="text-5xl">🔍</span>
                <p className="mt-4 text-text-muted">{t("noResults")}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Combo section */}
            <div id="combos" className="rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 border border-accent/20 shadow-sm">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3 mb-4">
                  <Tag size={22} className="text-accent" />
                  <div>
                    <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text-dark sm:text-xl">
                      {isEn ? "Combo Deals" : "Комбо понуде"}
                    </h2>
                    <span className="text-xs text-text-muted">
                      {isEn ? "Save with our special combos" : "Уштеди са нашим специјалним комбинацијама"}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {combos.map((combo) => (
                    <div
                      key={combo.id}
                      className="rounded-xl glass-card p-4"
                    >
                      <div className="text-2xl mb-2">{combo.emoji}</div>
                      <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-text-dark">
                        {isEn ? combo.nameEn : combo.name}
                      </h3>
                      <p className="mt-1 text-xs text-text-muted leading-relaxed">
                        {isEn ? combo.descriptionEn : combo.description}
                      </p>
                      {combo.discount > 0 && (
                        <span className="mt-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                          -{combo.discount}%
                        </span>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {combo.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => scrollToCategory(item.categoryId)}
                            className="rounded-md bg-cream-dark px-2 py-0.5 text-[10px] font-medium text-text-muted hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                          >
                            {isEn ? item.labelEn : item.label} ↓
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            {menuData.map((category, idx) => (
              <MenuCategory
                key={category.id}
                category={category}
                defaultOpen={idx === 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      <CartButton />
    </div>
  );
}
