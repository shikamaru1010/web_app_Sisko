"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Clock, MousePointer } from "lucide-react";

type Card = {
  id: number;
  image: string;
  matchId: number;
  flipped: boolean;
  matched: boolean;
};

const allImages = [
  "/images/cevapiULepinji.jpg",
  "/images/pljekaULepinji.jpg",
  "/images/kompletLepinja.jpg",
  "/images/rolovaniCevULepinji.jpg",
  "/images/pileceBeloULepinji.jpg",
  "/images/vratLepinja.jpg",
  "/images/ovalPomfLuk.jpg",
  "/images/punRostilj.jpg",
  "/images/pljekaOdKilo.jpg",
  "/images/velikaPljeka.jpg",
  "/images/4Ovala.jpg",
  "/images/rolovanoBeloULepinji.jpg",
];

type Difficulty = "easy" | "medium" | "hard";
const pairCounts: Record<Difficulty, number> = { easy: 4, medium: 6, hard: 8 };

function createCards(difficulty: Difficulty): Card[] {
  const count = pairCounts[difficulty];
  const selected = allImages.slice(0, count);
  const cards: Card[] = [];

  selected.forEach((img, idx) => {
    cards.push({ id: idx * 2, image: img, matchId: idx, flipped: false, matched: false });
    cards.push({ id: idx * 2 + 1, image: img, matchId: idx, flipped: false, matched: false });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryPage() {
  const t = useTranslations("fun");
  const locale = useLocale();
  const isEn = locale === "en";

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameWon) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setCards(createCards(diff));
    setFlippedIds([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const handleFlip = useCallback(
    (id: number) => {
      if (flippedIds.length === 2) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, flipped: true } : c
      );
      const newFlipped = [...flippedIds, id];
      setCards(newCards);
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [firstId, secondId] = newFlipped;
        const first = newCards.find((c) => c.id === firstId)!;
        const second = newCards.find((c) => c.id === secondId)!;

        if (first.matchId === second.matchId) {
          setTimeout(() => {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.matchId === first.matchId ? { ...c, matched: true } : c
              );
              if (updated.every((c) => c.matched)) {
                setGameWon(true);
              }
              return updated;
            });
            setFlippedIds([]);
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newFlipped.includes(c.id) ? { ...c, flipped: false } : c
              )
            );
            setFlippedIds([]);
          }, 1000);
        }
      }
    },
    [cards, flippedIds]
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Difficulty selection
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-charcoal px-4 pb-8 pt-8 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-light">
            {t("memory")}
          </h1>
        </div>
        <div className="mx-auto max-w-md px-4 py-12">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-xl font-semibold text-text-dark mb-6">
            {t("difficulty")}
          </h2>
          <div className="flex flex-col gap-3">
            {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className="rounded-xl glass-card px-6 py-4 text-center transition-all hover:-translate-y-0.5"
              >
                <span className="text-lg font-semibold text-text-dark">
                  {t(diff)}
                </span>
                <span className="ml-2 text-sm text-text-muted">
                  ({pairCounts[diff]} {t("pairs")})
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/zabava"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent"
            >
              <ArrowLeft size={16} />
              {isEn ? "Back to games" : "Назад на игре"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Won state
  if (gameWon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl">🏆</div>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-text-dark">
            {t("congratulations")}
          </h1>
          <div className="mt-4 flex justify-center gap-6 text-text-muted">
            <div className="flex items-center gap-2">
              <MousePointer size={18} />
              <span>{moves} {t("moves")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{formatTime(timer)}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => startGame(difficulty)}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
            >
              <RotateCcw size={18} />
              {t("tryAgain")}
            </button>
            <button
              onClick={() => setDifficulty(null)}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              {t("difficulty")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game board
  const cols = difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-5";

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-6 pt-6 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-text-light">
          {t("memory")}
        </h1>
        <div className="mt-2 flex items-center justify-center gap-6 text-sm text-text-light/60">
          <span className="flex items-center gap-1">
            <MousePointer size={14} /> {moves} {t("moves")}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatTime(timer)}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md px-3 py-6">
        <div className={`grid ${cols} gap-2`}>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="relative aspect-square overflow-hidden rounded-xl shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  card.flipped || card.matched
                    ? "opacity-0 rotate-y-180"
                    : "opacity-100"
                }`}
              >
                <div className="flex h-full items-center justify-center bg-primary text-3xl text-white rounded-xl">
                  ?
                </div>
              </div>
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  card.flipped || card.matched
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Image
                  src={card.image}
                  alt="Memory card"
                  fill
                  className={`rounded-xl object-cover ${
                    card.matched ? "ring-4 ring-green-400" : ""
                  }`}
                  sizes="100px"
                />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => startGame(difficulty)}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent"
          >
            <RotateCcw size={14} />
            {t("tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}
