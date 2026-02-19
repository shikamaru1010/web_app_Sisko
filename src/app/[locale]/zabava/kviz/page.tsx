"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { adultQuizQuestions } from "@/data/quiz-adults";

export default function QuizPage() {
  const t = useTranslations("fun");
  const locale = useLocale();
  const isEn = locale === "en";

  const questions = useMemo(
    () => [...adultQuizQuestions].sort(() => Math.random() - 0.5).slice(0, 10),
    []
  );

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
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
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <Trophy size={64} className="mx-auto text-accent" />
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-text-dark">
            {t("congratulations")}
          </h1>
          <p className="mt-4 text-5xl font-bold text-accent">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-text-muted">({percentage}%)</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
            >
              <RotateCcw size={18} />
              {t("tryAgain")}
            </button>
            <Link
              href="/zabava"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft size={18} />
              {isEn ? "Back to games" : "Назад на игре"}
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
          {t("quiz")}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-text-light/60">
          <span>
            {current + 1}/{questions.length}
          </span>
          <span>
            {t("score")}: {score}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-wood-dark/50">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
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
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-text-dark sm:text-2xl">
              {isEn ? q.questionEn : q.question}
            </h2>

            <div className="mt-6 flex flex-col gap-3">
              {(isEn ? q.optionsEn : q.options).map((option, idx) => {
                let style = "bg-white border-wood-light/30 hover:border-accent";
                if (selected !== null) {
                  if (idx === q.correct) {
                    style = "bg-green-50 border-green-400";
                  } else if (idx === selected && idx !== q.correct) {
                    style = "bg-red-50 border-red-400";
                  } else {
                    style = "bg-white border-wood-light/30 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-all ${style}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dark text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {selected !== null && idx === q.correct && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {selected !== null &&
                      idx === selected &&
                      idx !== q.correct && (
                        <XCircle size={20} className="text-red-500" />
                      )}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <p
                  className={`mb-4 text-center text-lg font-bold ${
                    selected === q.correct ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {selected === q.correct ? t("correct") : t("incorrect")}
                </p>
                <button
                  onClick={nextQuestion}
                  className="w-full rounded-xl bg-accent py-3 font-semibold text-white hover:bg-accent-hover transition-colors"
                >
                  {current + 1 >= questions.length
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
