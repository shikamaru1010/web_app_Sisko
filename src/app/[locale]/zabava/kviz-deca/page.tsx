"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { kidsQuizQuestions } from "@/data/quiz-kids";

export default function KidsQuizPage() {
  const t = useTranslations("fun");
  const locale = useLocale();
  const isEn = locale === "en";

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = kidsQuizQuestions[current];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (current + 1 >= kidsQuizQuestions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="text-6xl">🌟</div>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-text-dark">
            {t("congratulations")}
          </h1>
          <div className="mt-4 flex justify-center gap-1">
            {Array.from({ length: kidsQuizQuestions.length }).map((_, i) => (
              <Star
                key={i}
                size={28}
                className={i < score ? "fill-accent text-accent" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="mt-3 text-2xl font-bold text-accent">
            {score}/{kidsQuizQuestions.length}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-lg font-semibold text-white hover:bg-accent-hover"
            >
              <RotateCcw size={20} />
              {t("tryAgain")}
            </button>
            <Link
              href={`/${locale}/zabava`}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-lg font-semibold text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft size={20} />
              {isEn ? "Back" : "Назад"}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal px-4 pb-8 pt-8 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-text-light">
          {t("kidsQuiz")} {q.emoji}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-text-light/60">
          <span>
            {current + 1}/{kidsQuizQuestions.length}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: score }).map((_, i) => (
              <Star key={i} size={14} className="fill-accent text-accent" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-center text-5xl mb-4">{q.emoji}</div>
            <h2 className="text-center font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark sm:text-2xl">
              {isEn ? q.questionEn : q.question}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {(isEn ? q.optionsEn : q.options).map((option, idx) => {
                let style =
                  "bg-white border-wood-light/30 hover:border-accent hover:scale-105";
                if (selected !== null) {
                  if (idx === q.correct) {
                    style = "bg-green-100 border-green-400 scale-105";
                  } else if (idx === selected && idx !== q.correct) {
                    style = "bg-red-100 border-red-400";
                  } else {
                    style = "bg-white border-wood-light/30 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`rounded-2xl border-2 px-4 py-5 text-center text-base font-semibold transition-all ${style}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="mb-4 text-3xl">
                  {selected === q.correct ? "🎉" : "😅"}
                </p>
                <button
                  onClick={nextQuestion}
                  className="w-full rounded-xl bg-accent py-4 text-lg font-bold text-white hover:bg-accent-hover"
                >
                  {current + 1 >= kidsQuizQuestions.length
                    ? t("finish")
                    : t("nextQuestion")}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
