"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MenuSearch({ value, onChange }: Props) {
  const t = useTranslations("menu");

  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("search")}
        className="w-full rounded-xl border border-charcoal-light bg-charcoal-light py-3 pl-12 pr-10 text-sm text-text-dark placeholder:text-text-muted/60 shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:bg-cream-dark"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
