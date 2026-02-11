"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { getAvailableToppings } from "@/data/toppings";
import type { MenuItem as MenuItemType } from "@/data/menu";

type Props = {
  item: MenuItemType;
  showToppings?: boolean;
};

export default function MenuItem({ item, showToppings = false }: Props) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const isEn = locale === "en";
  const addItem = useCartStore((s) => s.addItem);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [toppingsOpen, setToppingsOpen] = useState(false);

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

  const handleAdd = () => {
    const toppingsText = showToppings && selectedToppings.length > 0
      ? ` + ${selectedToppings
          .map((id) => {
            const tp = availableToppings.find((t) => t.id === id);
            return tp ? (isEn ? tp.nameEn : tp.name) : "";
          })
          .join(", ")}`
      : "";

    addItem({
      id: showToppings && selectedToppings.length > 0
        ? `${item.id}-${selectedToppings.sort().join("-")}-${selectedOption}`
        : `${item.id}-${selectedOption}`,
      name: item.name + toppingsText,
      nameEn: item.nameEn + toppingsText,
      price: getPrice(),
      size: item.options?.[selectedOption]?.size,
      sizeEn: item.options?.[selectedOption]?.sizeEn,
      image: item.image,
    });

    // Reset toppings after adding
    if (showToppings) {
      setSelectedToppings([]);
      setToppingsOpen(false);
    }
  };

  const unit = item.unit ? (isEn ? item.unitEn : item.unit) : null;

  return (
    <div className="group rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
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
              {/* Size options */}
              {item.options && item.options.length > 1 && (
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

              {/* Price */}
              <span className="text-lg font-bold text-accent">
                {getPrice().toLocaleString("sr-RS")}
                <span className="text-sm font-normal text-text-muted">
                  {" "}
                  {isEn ? "RSD" : "дин"}
                  {unit && `/${unit}`}
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
        <div className="border-t border-cream-dark px-3 pb-3 pt-2 sm:px-4">
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
    </div>
  );
}
