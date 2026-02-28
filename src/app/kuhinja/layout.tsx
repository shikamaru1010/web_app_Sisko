import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Кухиња — Приказ поруџбина",
  robots: "noindex, nofollow",
};

export default function KuhinjaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#f0f0f0", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
