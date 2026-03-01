"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isEn = locale === "en";
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getComboDiscount, getTotalPrice, clearCart } =
    useCartStore();
  const [orderSent, setOrderSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Build order details for email
    const orderDetails = items
      .map((item) => {
        const name = isEn ? item.nameEn : item.name;
        const size = isEn ? item.sizeEn : item.size;
        const compText = item.composition && item.composition.length > 0
          ? `\n  → ${item.composition.map((c) => `${c.name} x${c.quantity}`).join(", ")}`
          : "";
        return `${name}${size ? ` (${size})` : ""} x${item.quantity} — ${(
          item.price * item.quantity
        ).toLocaleString("sr-RS")} ${isEn ? "RSD" : "дин"}${compText}`;
      })
      .join("\n");

    const total = getTotalPrice();

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          total,
          orderDetails,
        }),
      });

      const data = await res.json();

      if (data.orderId) {
        clearCart();
        router.push(`/porudzbina/${data.orderId}`);
        return;
      }
    } catch {
      // Fallback to static success if API fails
    }

    setSubmitting(false);
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
          <CheckCircle size={64} className="mx-auto text-green-500" />
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
            {t("successTitle")}
          </h1>
          <p className="mt-2 text-text-muted">{t("successDesc")}</p>
          <Link
            href="/meni"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-all hover:bg-accent-hover"
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
          <ShoppingCart size={64} className="mx-auto text-text-muted/30" />
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-text-dark">
            {t("empty")}
          </h1>
          <p className="mt-2 text-text-muted">{t("emptyDesc")}</p>
          <Link
            href="/meni"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-all hover:bg-accent-hover"
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
      <div className="bg-charcoal px-4 pb-8 pt-8 text-center gradient-border-bottom">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-glow sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-text-light/60">
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
              className="flex items-center gap-3 rounded-xl glass-card-flat p-3 sm:gap-4 sm:p-4"
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
                  <span className="text-2xl opacity-40">🍖</span>
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
                {item.composition && item.composition.length > 0 && (
                  <p className="mt-0.5 text-[11px] text-text-muted leading-snug">
                    {item.composition
                      .map((c) => `${isEn ? c.nameEn : c.name} x${c.quantity}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-sm font-bold text-accent">
                  {(item.price * item.quantity).toLocaleString("sr-RS")}{" "}
                  {isEn ? "RSD" : "дин"}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const step = item.quantity % 1 !== 0 || item.quantity <= 1 ? 0.25 : 1;
                    updateQuantity(item.id, Math.round((item.quantity - step) * 100) / 100, item.size);
                  }}
                  className="rounded-lg bg-cream-dark p-1.5 text-text-muted hover:bg-wood-light/50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity % 1 !== 0 ? item.quantity.toFixed(2) : item.quantity}
                </span>
                <button
                  onClick={() => {
                    const step = item.quantity % 1 !== 0 ? 0.25 : 1;
                    updateQuantity(item.id, Math.round((item.quantity + step) * 100) / 100, item.size);
                  }}
                  className="rounded-lg bg-cream-dark p-1.5 text-text-muted hover:bg-wood-light/50"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="ml-1 rounded-lg p-1.5 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 rounded-xl bg-charcoal px-6 py-4 text-text-light shadow-lg border border-accent/10">
          {getComboDiscount() > 0 && (
            <>
              <div className="flex items-center justify-between pb-2 text-sm text-text-light/70">
                <span>{t("subtotal")}</span>
                <span>{getSubtotal().toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}</span>
              </div>
              <div className="flex items-center justify-between pb-3 text-sm font-medium text-green-400">
                <span>{t("comboDiscount")} −10%</span>
                <span>−{getComboDiscount().toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}</span>
              </div>
              <div className="border-t border-white/10 pt-3" />
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{t("total")}</span>
            <span className="text-2xl font-bold text-accent">
              {getTotalPrice().toLocaleString("sr-RS")} {isEn ? "RSD" : "дин"}
            </span>
          </div>
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
              className="w-full rounded-lg px-4 py-2.5 text-sm text-text-dark input-premium"
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
              className="w-full rounded-lg px-4 py-2.5 text-sm text-text-dark input-premium"
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
              className="w-full resize-none rounded-lg border border-charcoal-light bg-charcoal-light px-4 py-2.5 text-sm text-text-dark transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* Payment note */}
          <div className="flex items-center gap-2 rounded-lg bg-wood-light/20 px-4 py-3 text-sm text-text-muted">
            <CreditCard size={18} className="shrink-0 text-primary" />
            {t("paymentNote")}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="shimmer-btn flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 text-base font-bold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/35 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isEn ? "Sending..." : "Слање..."}
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                {t("submit")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
