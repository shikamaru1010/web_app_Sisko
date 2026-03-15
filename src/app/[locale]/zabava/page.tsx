"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Brain, Puzzle, Gamepad2, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function FunPage() {
  const t = useTranslations("fun");
  const locale = useLocale();

  const games = [
    {
      href: `/${locale}/zabava/kviz`,
      icon: <Brain size={32} className="text-accent" />,
      title: t("quiz"),
      desc: t("quizDesc"),
      category: t("forAdults"),
      color: "from-accent/8 to-secondary/8",
      borderColor: "border-accent/15",
    },
    {
      href: `/${locale}/zabava/kviz-deca`,
      icon: <Puzzle size={32} className="text-ember" />,
      title: t("kidsQuiz"),
      desc: t("kidsQuizDesc"),
      category: t("forKids"),
      color: "from-ember/8 to-accent/8",
      borderColor: "border-ember/15",
    },
    {
      href: `/${locale}/zabava/memory`,
      icon: <Gamepad2 size={32} className="text-primary" />,
      title: t("memory"),
      desc: t("memoryDesc"),
      category: t("forKids"),
      color: "from-primary/8 to-wood-light/15",
      borderColor: "border-primary/15",
    },
    {
      href: `/${locale}/zabava/sastavi-obrok`,
      icon: <UtensilsCrossed size={32} className="text-secondary" />,
      title: t("buildMeal"),
      desc: t("buildMealDesc"),
      category: t("forKids"),
      color: "from-secondary/8 to-wood-light/15",
      borderColor: "border-secondary/15",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="page-header px-4 pb-12 pt-10 text-center">
        <span className="text-4xl">🎮</span>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-text-light text-shadow-subtle sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-text-light/50">{t("subtitle")}</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={game.href}
                className={`group block rounded-2xl border ${game.borderColor} bg-gradient-to-br ${game.color} p-7 transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <span className="inline-block rounded-full border border-wood-light/20 bg-white/90 px-3 py-1 text-xs font-medium text-text-muted">
                  {game.category}
                </span>
                <div className="mt-5 mb-3">{game.icon}</div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark">
                  {game.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{game.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all group-hover:gap-2.5">
                  {t("startGame")}
                  <ArrowRight size={15} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
