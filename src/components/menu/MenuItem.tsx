"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { getAvailableToppings } from "@/data/toppings";
import { COMPOSABLE_PIECES } from "@/data/menu";
import type { MenuItem as MenuItemType } from "@/data/menu";

type Props = {
  item: MenuItemType;
  showToppings?: boolean;
};

const WEIGHT_OPTIONS = [
  { value: 0.25, label: "250г", labelEn: "250g" },
  { value: 0.5, label: "500г", labelEn: "500g" },
  { value: 0.75, label: "750г", labelEn: "750g" },
  { value: 1, label: "1кг", labelEn: "1kg" },
];

export default function MenuItem({ item, showToppings = false }: Props) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const isEn = locale === "en";
  const addItem = useCartStore((s) => s.addItem);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [toppingsOpen, setToppingsOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(0.5);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [composition, setComposition] = useState<Record<string, number>>({});

  const isKgItem = item.unit === "кг" || item.unitEn === "kg";

  const name = isEn ? item.nameEn : item.name;
  const description = isEn ? item.descriptionEn : item.description;
  const availableToppings = getAvailableToppings();

  const getPrice = () => {
    if (item.options && item.options.length > 0) {
      return item.options[selectedOption].price;
    }
    return item.price || 0;
  };

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const updatePieceQty = (pieceId: string, delta: number) => {
    setComposition((prev) => {
      const current = prev[pieceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [pieceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [pieceId]: next };
    });
  };

  const compositionEntries = Object.entries(composition).filter(([, qty]) => qty > 0);
  const hasComposition = compositionEntries.length > 0;

  const handleAdd = () => {
    const toppingsText = showToppings && selectedToppings.length > 0
      ? ` + ${selectedToppings
          .map((id) => {
            const tp = availableToppings.find((t) => t.id === id);
            return tp ? (isEn ? tp.nameEn : tp.name) : "";
          })
          .join(", ")}`
      : "";

    // Build composition data for composable items
    const compositionData = item.composable && hasComposition
      ? compositionEntries.map(([pieceId, qty]) => {
          const piece = COMPOSABLE_PIECES.find((p) => p.id === pieceId);
          return {
            name: piece?.name || pieceId,
            nameEn: piece?.nameEn || pieceId,
            quantity: qty,
          };
        })
      : undefined;

    const compositionIdSuffix = item.composable && hasComposition
      ? `-comp-${compositionEntries.map(([id, qty]) => `${id}${qty}`).sort().join("-")}`
      : "";

    addItem(
      {
        id: showToppings && selectedToppings.length > 0
          ? `${item.id}-${selectedToppings.sort().join("-")}-${selectedOption}`
          : `${item.id}-${selectedOption}${compositionIdSuffix}`,
        name: item.name + toppingsText,
        nameEn: item.nameEn + toppingsText,
        price: getPrice(),
        size: isKgItem
          ? `${selectedWeight * 1000}г`
          : item.options?.[selectedOption]?.size,
        sizeEn: isKgItem
          ? `${selectedWeight * 1000}g`
          : item.options?.[selectedOption]?.sizeEn,
        image: item.image,
        composition: compositionData,
      },
      isKgItem ? selectedWeight : 1
    );

    // Reset toppings after adding
    if (showToppings) {
      setSelectedToppings([]);
      setToppingsOpen(false);
    }

    // Reset composition after adding
    if (item.composable) {
      setComposition({});
      setCompositionOpen(false);
    }
  };

  const unit = item.unit ? (isEn ? item.unitEn : item.unit) : null;

  return (
    <div className="group rounded-xl glass-card transition-all">
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Image */}
        {item.image ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
            <Image
              src={item.image}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-cream-dark sm:h-24 sm:w-24">
            <span className="text-3xl opacity-40">🍖</span>
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-text-dark sm:text-base">
              {name}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs text-text-muted line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* Size options (non-kg items) */}
              {!isKgItem && item.options && item.options.length > 1 && (
                <div className="flex gap-1">
                  {item.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                        selectedOption === idx
                          ? "bg-primary text-white"
                          : "bg-cream-dark text-text-muted hover:bg-wood-light/50"
                      }`}
                    >
                      {isEn ? opt.sizeEn : opt.size}
                    </button>
                  ))}
                </div>
              )}

              {/* Weight selector for kg items */}
              {isKgItem && (
                <div className="flex gap-1">
                  {WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedWeight(opt.value)}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                        selectedWeight === opt.value
                          ? "bg-primary text-white"
                          : "bg-cream-dark text-text-muted hover:bg-wood-light/50"
                      }`}
                    >
                      {isEn ? opt.labelEn : opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Price */}
              <span className="text-lg font-bold text-accent">
                {isKgItem
                  ? Math.round(getPrice() * selectedWeight).toLocaleString("sr-RS")
                  : getPrice().toLocaleString("sr-RS")}
                <span className="text-sm font-normal text-text-muted">
                  {" "}
                  {isEn ? "RSD" : "дин"}
                  {isKgItem && (
                    <span className="text-xs">
                      {" "}({getPrice().toLocaleString("sr-RS")}/{unit})
                    </span>
                  )}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Toppings toggle */}
              {showToppings && (
                <button
                  onClick={() => setToppingsOpen(!toppingsOpen)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    toppingsOpen || selectedToppings.length > 0
                      ? "bg-primary/10 text-primary"
                      : "bg-cream-dark text-text-muted hover:bg-wood-light/50"
                  }`}
                >
                  {isEn ? "Toppings" : "Зачини"}
                  {selectedToppings.length > 0 && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-white">
                      {selectedToppings.length}
                    </span>
                  )}
                  {toppingsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}

              {/* Composition toggle for composable items */}
              {item.composable && (
                <button
                  onClick={() => setCompositionOpen(!compositionOpen)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    compositionOpen || hasComposition
                      ? "bg-primary/10 text-primary"
                      : "bg-cream-dark text-text-muted hover:bg-wood-light/50"
                  }`}
                >
                  {t("composeMix")}
                  {hasComposition && (
                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-white">
                      {compositionEntries.length}
                    </span>
                  )}
                  {compositionOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md active:scale-95 sm:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t("addToCart")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toppings selector */}
      {showToppings && toppingsOpen && (
        <div className="border-t border-charcoal-light px-3 pb-3 pt-2 sm:px-4">
          <p className="mb-2 text-xs font-medium text-text-muted">
            {isEn ? "Choose your toppings:" : "Изабери зачине:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableToppings.map((topping) => {
              const isSelected = selectedToppings.includes(topping.id);
              return (
                <button
                  key={topping.id}
                  onClick={() => toggleTopping(topping.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-accent text-white shadow-sm"
                      : "bg-cream-dark text-text-dark hover:bg-wood-light/50"
                  }`}
                >
                  {isEn ? topping.nameEn : topping.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Composition builder for mixed meat */}
      {item.composable && compositionOpen && (
        <div className="border-t border-charcoal-light px-3 pb-3 pt-2 sm:px-4">
          <p className="mb-2 text-xs font-medium text-text-muted">
            {t("choosePieces")}
          </p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {COMPOSABLE_PIECES.map((piece) => {
              const qty = composition[piece.id] || 0;
              return (
                <div
                  key={piece.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    qty > 0
                      ? "bg-accent/10 text-text-dark"
                      : "bg-cream-dark text-text-muted"
                  }`}
                >
                  <span className="font-medium truncate mr-2">
                    {isEn ? piece.nameEn : piece.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updatePieceQty(piece.id, -1)}
                      className="rounded bg-charcoal-light p-0.5 text-text-muted hover:bg-wood-light/50 disabled:opacity-30"
                      disabled={qty === 0}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => updatePieceQty(piece.id, 1)}
                      className="rounded bg-charcoal-light p-0.5 text-text-muted hover:bg-wood-light/50"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-text-muted w-6">{t("pcs")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
