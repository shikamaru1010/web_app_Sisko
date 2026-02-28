"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: "sr" | "en") => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-wood-light/30 p-1">
      <button
        onClick={() => switchLocale("sr")}
        disabled={isPending}
        aria-label="Srpski jezik"
        aria-current={locale === "sr" ? true : undefined}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          locale === "sr"
            ? "bg-primary text-white shadow-sm"
            : "text-text-dark hover:bg-wood-light/50"
        }`}
      >
        СР
      </button>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        aria-label="English language"
        aria-current={locale === "en" ? true : undefined}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          locale === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-text-dark hover:bg-wood-light/50"
        }`}
      >
        EN
      </button>
    </div>
  );
}
