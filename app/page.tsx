"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../components/sections/Header";
import SentenceResult from "@/components/ui/SentenceResult";

const SAMPLE_SENTENCES = [
  "The sun shines brightly over the high green mountains today. The sun shines brightly over the high green mountains today.",
  "Learning to program requires time lots of practice and patience.",
  "Technology advances very fast transforming our digital world every day.",
  "A hot cup of coffee in the morning always helps to start well.",
  "Writing fast and accurately is a very useful skill always.",
];

export type Stats = {
  sentenceIndex: number;
  wpm: number;
  accuracy: number;
  errors: number;
  time: string;
};

export default function SpeedTypeApp() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [typedInput, setTypedInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [history, setHistory] = useState<Stats[]>([]);
  const [lastStats, setLastStats] = useState<Stats>({
    sentenceIndex: 0,
    wpm: 0,
    accuracy: 0,
    errors: 0,
    time: "0.0",
  });

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const targetText = SAMPLE_SENTENCES[currentSentenceIndex];

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [currentSentenceIndex]);

  const handleContainerClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const previousLength = typedInput.length;
    const newLength = val.length;

    if (newLength > targetText.length) return;

    if (!startTime && newLength > 0) {
      setStartTime(Date.now());
    }

    if (newLength > previousLength) {
      const addedChar = val[newLength - 1];
      const expectedChar = targetText[newLength - 1];
      if (addedChar !== expectedChar) {
        setErrorsCount((prev) => prev + 1);
      }
    }

    setTypedInput(val);

    if (newLength === targetText.length) {
      const finishTime = Date.now();
      finishSentence(finishTime);
    }
  };

  const finishSentence = (finishTime: number) => {
    const timeInMinutes = (finishTime - (startTime || Date.now())) / 60000;
    const wordsCount = targetText.length / 5;
    const calculatedWpm =
      timeInMinutes > 0 ? Math.round(wordsCount / timeInMinutes) : 0;
    const accuracy = Math.max(
      0,
      Math.round(100 - (errorsCount / targetText.length) * 100)
    );

    const stats: Stats = {
      sentenceIndex: currentSentenceIndex + 1,
      wpm: calculatedWpm,
      accuracy: accuracy,
      errors: errorsCount,
      time: ((finishTime - (startTime || Date.now())) / 1000).toFixed(1),
    };

    setLastStats(stats);
    setHistory((prev) => [...prev, stats]);

    setTimeout(() => {
      setCurrentSentenceIndex((prev) => (prev + 1) % SAMPLE_SENTENCES.length);
      setTypedInput("");
      setStartTime(null);
      setErrorsCount(0);
    }, 300);
  };

  const restartAll = () => {
    setCurrentSentenceIndex(0);
    setTypedInput("");
    setStartTime(null);
    setErrorsCount(0);
    setHistory([]);
    setLastStats({
      sentenceIndex: 0,
      wpm: 0,
      accuracy: 0,
      errors: 0,
      time: "0:0",
    });
    setTimeout(() => {
      if (hiddenInputRef.current) hiddenInputRef.current.focus();
    }, 50);
  };

  return (
    <div className="flex flex-col h-screen items-center p-4 sm:p-8 font-sans">
      <Header />

      <main
        className="flex flex-col gap-10 w-full max-w-4xl h-full"
        onClick={handleContainerClick}
      >
        {/* Sentence results */}
        {lastStats && (
          <SentenceResult
            lastStats={lastStats}
            finishSentence={finishSentence}
          />
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="font-mono">
            Frases completadas:{" "}
            <span className="font-bold">{history.length}</span>{" "}
            <span className="ml-2">
              (Actual: #{currentSentenceIndex + 1} de {SAMPLE_SENTENCES.length})
            </span>
          </span>
          <span className="text-xs">Modo Infinito Activo</span>
        </div>

        {/* Input text box */}
        <div className="relative w-full h-80 flex items-start min-h-40">
          <input
            ref={hiddenInputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            className="absolute opacity-0 inset-0 pointer-events-auto"
            autoFocus
          />

          <div className="text-xl font-mono leading-relaxed select-none tracking-wide w-full flex flex-wrap gap-x-2">
            {(() => {
              let globalIndex = 0;
              return targetText.split(" ").map((word, wordIdx) => {
                const wordChars = word.split("");
                const wordStartIndex = globalIndex;
                // +1 para contar el espacio que separa las palabras
                globalIndex += wordChars.length + 1;

                return (
                  <span
                    key={wordIdx}
                    className="inline-flex whitespace-nowrap"
                  >
                    {wordChars.map((char, charIdx) => {
                      const idx = wordStartIndex + charIdx;
                      const isTyped = idx < typedInput.length;
                      const isCorrect = isTyped && typedInput[idx] === char;
                      const isCurrentCursor = idx === typedInput.length;

                      let charClass = "text-foreground";
                      if (isTyped) {
                        charClass = isCorrect
                          ? "text-emerald-400"
                          : "text-rose-500 bg-rose-500/10 rounded-sm";
                      }

                      return (
                        <span key={charIdx} className="relative inline">
                          {isCurrentCursor && (
                            <span className="absolute -left-px top-1 bottom-0 w-0.5 h-6 bg-primary animate-pulse rounded-full" />
                          )}
                          <span className={charClass}>{char}</span>
                        </span>
                      );
                    })}

                    {/* Espacio entre palabras (si no es la última palabra) */}
                    {wordIdx < targetText.split(" ").length - 1 && (
                      (() => {
                        const spaceIdx = wordStartIndex + wordChars.length;
                        const isTyped = spaceIdx < typedInput.length;
                        const isCorrect = isTyped && typedInput[spaceIdx] === " ";
                        const isCurrentCursor = spaceIdx === typedInput.length;

                        let spaceClass = "text-foreground";
                        if (isTyped) {
                          spaceClass = isCorrect
                            ? "text-emerald-400"
                            : "text-rose-500 bg-rose-500/10 rounded-sm";
                        }

                        return (
                          <span className="relative inline">
                            {isCurrentCursor && (
                              <span className="absolute -left-px top-1 bottom-0 w-0.5 h-6 bg-primary animate-pulse rounded-full" />
                            )}
                            <span className={spaceClass}> </span>
                          </span>
                        );
                      })()
                    )}
                  </span>
                );
              });
            })()}
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs mt-8">
        Pulsa cualquier tecla para escribir. Las frases se repetirán de forma
        continua en bucle.
      </footer>
    </div>
  );
}
