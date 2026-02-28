import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Праћење поруџбине — Месара Шишко",
  robots: "noindex, nofollow",
};

export default function PorudzbinaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
      <body className="min-h-screen bg-cream text-text-dark" style={{ fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
