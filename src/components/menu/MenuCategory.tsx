"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import MenuItem from "./MenuItem";
import type { MenuCategory as MenuCategoryType } from "@/data/menu";

type Props = {
  category: MenuCategoryType;
  defaultOpen?: boolean;
};

export default function MenuCategory({ category, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const locale = useLocale();
  const t = useTranslations("menu");
  const isEn = locale === "en";

  const name = isEn ? category.nameEn : category.name;

  return (
    <div className="overflow-hidden rounded-2xl bg-cream-dark/50 shadow-sm" id={category.id}>
      {/* Category header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-cream-dark sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-text-dark sm:text-xl">
              {name}
            </h2>
            <span className="text-xs text-text-muted">
              {category.items.length} {t("items")}
            </span>
          </div>
        </div>
        <ChevronDown
          size={24}
          className={`text-text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Items */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[5000px] opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-3 pb-4 sm:gap-3 sm:px-5">
          {category.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              categoryId={category.id}
              showToppings={category.id === "grill-bread"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
