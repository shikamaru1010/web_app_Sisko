"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      >
        <Link
          href={`/${locale}/korpa`}
          className="btn-primary flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-white shadow-xl ring-1 ring-accent/30 transition-all hover:bg-accent-hover hover:shadow-2xl active:scale-95"
        >
          <ShoppingCart size={18} />
          <span className="font-semibold tracking-wide">
            {t("order")} ({totalItems})
          </span>
          <span className="rounded-full bg-white/15 px-3 py-0.5 text-sm font-bold tabular-nums">
            {totalPrice.toLocaleString("sr-RS")} {locale === "en" ? "RSD" : "дин"}
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
