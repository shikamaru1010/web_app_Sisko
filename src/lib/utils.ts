export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number, locale: string = "sr"): string {
  const formatted = price.toLocaleString("sr-RS");
  return locale === "en" ? `${formatted} RSD` : `${formatted} дин`;
}
