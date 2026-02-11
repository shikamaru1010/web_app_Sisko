"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Brain, Puzzle, Gamepad2, UtensilsCrossed } from "lucide-react";

export default function FunPage() {
  const t = useTranslations("fun");
  const locale = useLocale();

  const games = [
    {
      href: `/${locale}/zabava/kviz`,
      icon: <Brain size={36} className="text-accent" />,
      title: t("quiz"),
      desc: t("quizDesc"),
      category: t("forAdults"),
      color: "from-accent/10 to-secondary/10",
    },
    {
      href: `/${locale}/zabava/kviz-deca`,
      icon: <Puzzle size={36} className="text-ember" />,
      title: t("kidsQuiz"),
      desc: t("kidsQuizDesc"),
      category: t("forKids"),
      color: "from-ember/10 to-accent/10",
    },
    {
      href: `/${locale}/zabava/memory`,
      icon: <Gamepad2 size={36} className="text-primary" />,
      title: t("memory"),
      desc: t("memoryDesc"),
      category: t("forKids"),
      color: "from-primary/10 to-wood-light/20",
    },
    {
      href: `/${locale}/zabava/sastavi-obrok`,
      icon: <UtensilsCrossed size={36} className="text-secondary" />,
      title: t("buildMeal"),
      desc: t("buildMealDesc"),
      category: t("forKids"),
      color: "from-secondary/10 to-wood-light/20",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal px-4 pb-10 pt-8 text-center">
        <span className="text-5xl">🎮</span>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/60">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={game.href}
                className={`group block rounded-2xl bg-gradient-to-br ${game.color} p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <span className="inline-block rounded-lg bg-white/80 px-2.5 py-1 text-xs font-medium text-text-muted">
                  {game.category}
                </span>
                <div className="mt-4 mb-3">{game.icon}</div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark">
                  {game.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted">{game.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                  {t("startGame")} →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
