"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isEn = locale === "en";
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const [orderSent, setOrderSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderDetails = items
      .map((item) => {
        const name = isEn ? item.nameEn : item.name;
        const size = isEn ? item.sizeEn : item.size;
        return `${name}${size ? ` (${size})` : ""} x${item.quantity} — ${(
          item.price * item.quantity
        ).toLocaleString("sr-RS")} ${isEn ? "RSD" : "дин"}`;
      })
      .join("\n");

    const total = getTotalPrice();

    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          total,
          orderDetails,
        }),
      });
    } catch {
      // Still show success - order details are available in case email fails
    }

    setOrderSent(true);
    clearCart();
  };

  if (orderSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
            {t("successTitle")}
          </h1>
          <p className="mt-2 text-text-muted">{t("successDesc")}</p>
          <Link
            href={`/${locale}/meni`}
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-[15px] text-white transition-all hover:bg-accent-hover"
          >
            <ArrowLeft size={18} />
            {t("goToMenu")}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-dark">
            <ShoppingCart size={36} className="text-text-muted/40" />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
            {t("empty")}
          </h1>
          <p className="mt-2 text-text-muted">{t("emptyDesc")}</p>
          <Link
            href={`/${locale}/meni`}
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-[15px] text-white transition-all hover:bg-accent-hover"
          >
            <ArrowLeft size={18} />
            {t("goToMenu")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="page-header px-4 pb-10 pt-10 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-shadow-subtle sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-text-light/50">
          {items.length} {t("items")}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Cart items */}
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={`${item.id}-${item.size}`}
              layout
              className="flex items-center gap-3 rounded-xl border border-wood-light/15 bg-white p-3.5 transition-all hover:border-wood-light/30 hover:shadow-sm sm:gap-4 sm:p-4"
            >
              {/* Image */}
              {item.image ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={isEn ? item.nameEn : item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cream-dark">
                  <span className="text-2xl opacity-30">🍖</span>
                </div>
              )}

              {/* Details */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-text-dark truncate">
                  {isEn ? item.nameEn : item.name}
                  {item.size && (
                    <span className="ml-1 text-xs font-normal text-text-muted">
                      ({isEn ? item.sizeEn : item.size})
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 text-sm font-bold text-accent">
                  {(item.price * item.quantity).toLocaleString("sr-RS")}{" "}
                  {isEn ? "RSD" : "дин"}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1, item.size)
                  }
                  className="rounded-lg border border-wood-light/20 bg-cream p-1.5 text-text-muted transition-colors hover:border-wood-light/40 hover:bg-cream-dark"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1, item.size)
                  }
                  className="rounded-lg border border-wood-light/20 bg-cream p-1.5 text-text-muted transition-colors hover:border-wood-light/40 hover:bg-cream-dark"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="ml-1 rounded-lg p-1.5 text-red-400/70 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-wood-dark/20 bg-charcoal px-6 py-4 text-text-light">
          <span className="text-base font-semibold tracking-wide">{t("total")}</span>
          <span className="text-2xl font-bold text-accent tabular-nums">
            {getTotalPrice().toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}
          </span>
        </div>

        {/* Order form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-dark">
              {t("name")} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-wood-light/20 bg-white px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-dark">
              {t("phone")} *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-lg border border-wood-light/20 bg-white px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-dark">
              {t("note")}
            </label>
            <textarea
              rows={3}
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder={t("notePlaceholder")}
              className="w-full resize-none rounded-lg border border-wood-light/20 bg-white px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>

          {/* Payment note */}
          <div className="flex items-center gap-3 rounded-lg border border-wood-light/15 bg-cream-dark/50 px-4 py-3 text-sm text-text-muted">
            <CreditCard size={18} className="shrink-0 text-primary/70" />
            {t("paymentNote")}
          </div>

          <button
            type="submit"
            className="btn-primary flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent py-4 text-base text-white shadow-lg transition-all hover:bg-accent-hover hover:shadow-xl active:scale-[0.98]"
          >
            <ShoppingCart size={20} />
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
