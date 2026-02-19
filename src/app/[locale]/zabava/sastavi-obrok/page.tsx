"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
import { menuData } from "@/data/menu";
import { useCartStore } from "@/lib/cart-store";

type SelectedItem = {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  category: string;
};

const categories = [
  { id: "grill-bread", emoji: "🥙", label: "Месо", labelEn: "Meat" },
  { id: "sides-bread", emoji: "🍞", label: "Додаци", labelEn: "Sides" },
  { id: "salads", emoji: "🥗", label: "Салате", labelEn: "Salads" },
  { id: "drinks", emoji: "🥤", label: "Пиће", labelEn: "Drinks" },
];

export default function BuildMealPage() {
  const t = useTranslations("fun");
  const locale = useLocale();
  const isEn = locale === "en";
  const addItem = useCartStore((s) => s.addItem);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("grill-bread");

  const currentCategory = menuData.find((c) => c.id === activeCategory);

  const toggleItem = (item: {
    id: string;
    name: string;
    nameEn: string;
    price: number;
  }) => {
    const exists = selected.find((s) => s.id === item.id);
    if (exists) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([
        ...selected,
        { ...item, quantity: 1, category: activeCategory },
      ]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setSelected((prev) =>
      prev
        .map((s) => (s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s))
        .filter((s) => s.quantity > 0)
    );
  };

  const total = selected.reduce((sum, s) => sum + s.price * s.quantity, 0);

  const addAllToCart = () => {
    selected.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          nameEn: item.nameEn,
          price: item.price,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-cream pb-32">
      <div className="bg-charcoal px-4 pb-8 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-light">
          {t("buildMeal")} 🍽️
        </h1>
        <p className="mt-1 text-sm text-text-light/60">{t("buildMealDesc")}</p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-accent text-white shadow-md"
                  : "bg-white text-text-dark hover:bg-cream-dark"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{isEn ? cat.labelEn : cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="mt-4 space-y-2">
          {currentCategory?.items.map((item) => {
            const price = item.price || item.options?.[0]?.price || 0;
            const isSelected = selected.some((s) => s.id === item.id);
            const sel = selected.find((s) => s.id === item.id);

            return (
              <motion.div
                key={item.id}
                layout
                className={`flex items-center justify-between rounded-xl p-3 transition-all ${
                  isSelected
                    ? "bg-accent/10 border-2 border-accent"
                    : "bg-white border-2 border-transparent"
                }`}
              >
                <button
                  onClick={() =>
                    toggleItem({
                      id: item.id,
                      name: item.name,
                      nameEn: item.nameEn,
                      price,
                    })
                  }
                  className="flex-1 text-left"
                >
                  <span className="text-sm font-semibold text-text-dark">
                    {isEn ? item.nameEn : item.name}
                  </span>
                  <span className="ml-2 text-sm text-accent font-bold">
                    {price.toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}
                  </span>
                </button>

                {isSelected && sel && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="rounded-lg bg-cream-dark p-1 hover:bg-wood-light/50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">
                      {sel.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="rounded-lg bg-cream-dark p-1 hover:bg-wood-light/50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar - meal summary */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-charcoal px-4 py-4 shadow-2xl"
          >
            <div className="mx-auto max-w-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-light">
                    {t("yourMeal")} ({selected.length} {isEn ? "items" : "ставки"})
                  </h3>
                  <p className="text-xs text-text-light/60">
                    {selected
                      .map((s) => (isEn ? s.nameEn : s.name))
                      .join(", ")}
                  </p>
                </div>
                <span className="text-xl font-bold text-accent">
                  {total.toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected([])}
                  className="flex items-center gap-1 rounded-lg bg-wood-dark/50 px-4 py-2.5 text-sm text-text-light hover:bg-wood-dark"
                >
                  <RotateCcw size={14} />
                </button>
                <Link
                  href="/korpa"
                  onClick={addAllToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-semibold text-white hover:bg-accent-hover"
                >
                  <ShoppingCart size={18} />
                  {t("addToCartFromGame")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
