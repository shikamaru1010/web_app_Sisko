"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-wood-dark/20 bg-white/5 p-0.5">
      <button
        onClick={() => switchLocale("sr")}
        disabled={isPending}
        className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-all ${
          locale === "sr"
            ? "bg-primary text-white shadow-sm"
            : "text-text-light/60 hover:text-text-light"
        }`}
      >
        СР
      </button>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-all ${
          locale === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-text-light/60 hover:text-text-light"
        }`}
      >
        EN
      </button>
    </div>
  );
}
