"use client"

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Trophy, CheckCircle2, AlertCircle, Gauge, Target, Sparkles } from 'lucide-react';

const SAMPLE_SENTENCES = [
  "El sol brilla intensamente sobre las montañas altas y verdes hoy.",
  "Aprender a programar requiere tiempo mucha práctica y paciencia constante.",
  "La tecnología avanza muy rápido transformando nuestro mundo digital cada día.",
  "Un café caliente por la mañana siempre ayuda a empezar bien.",
  "Escribir rápido y con precisión es una habilidad muy útil siempre."
];

type Stats = {
  sentenceIndex: number,
  wpm: number,
  accuracy: number,
  errors: number,
  time: string
}

export default function App() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [allFinished, setAllFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<Stats[]>([]);
  const [lastStats, setLastStats] = useState<Stats | null>(null);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const targetText = SAMPLE_SENTENCES[currentSentenceIndex];

  // Auto-focus logic
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [currentSentenceIndex, allFinished]);

  // Keep focus when clicking anywhere on the test card
  const handleContainerClick = () => {
    if (hiddenInputRef.current && !allFinished) {
      hiddenInputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (allFinished) return;

    const val = e.target.value;
    const previousLength = typedInput.length;
    const newLength = val.length;

    // Do not allow typing beyond the current sentence length
    if (newLength > targetText.length) return;

    // Start timer on first keystroke
    if (!startTime && newLength > 0) {
      setStartTime(Date.now());
    }

    // Error detection on new character typed (forward typing)
    if (newLength > previousLength) {
      const addedChar = val[newLength - 1];
      const expectedChar = targetText[newLength - 1];
      if (addedChar !== expectedChar) {
        setErrorsCount((prev) => prev + 1);
      }
    }

    setTypedInput(val);

    // Sentence completed check
    if (newLength === targetText.length) {
      const finishTime = Date.now();
      setEndTime(finishTime);
      finishSentence(val, finishTime);
    }
  };

  const finishSentence = (finalInput: string, finishTime: number) => {
    const timeInMinutes = (finishTime - (startTime || Date.now())) / 60000;
    // Standard WPM: (characters typed / 5) / time in minutes
    const wordsCount = targetText.length / 5;
    const calculatedWpm = timeInMinutes > 0 ? Math.round(wordsCount / timeInMinutes) : 0;

    // Calculate accuracy: percentage of correct characters relative to target text length
    let correctChars = 0;
    for (let i = 0; i < targetText.length; i++) {
      if (finalInput[i] === targetText[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / targetText.length) * 100);

    const stats: Stats = {
      sentenceIndex: currentSentenceIndex + 1,
      wpm: calculatedWpm,
      accuracy: accuracy,
      errors: errorsCount + (finalInput[finalInput.length - 1] !== targetText[targetText.length - 1] && finalInput.length === targetText.length ? 0 : 0),
      time: ((finishTime - (startTime || Date.now())) / 1000).toFixed(1)
    };

    setLastStats(stats);
    setHistory((prev) => [...prev, stats]);

    // Transition to next sentence or complete all
    if (currentSentenceIndex < SAMPLE_SENTENCES.length - 1) {
      setTimeout(() => {
        setCurrentSentenceIndex((prev) => prev + 1);
        setTypedInput('');
        setStartTime(null);
        setEndTime(null);
        setErrorsCount(0);
      }, 300);
    } else {
      setAllFinished(true);
    }
  };

  const restartAll = () => {
    setCurrentSentenceIndex(0);
    setTypedInput('');
    setStartTime(null);
    setEndTime(null);
    setErrorsCount(0);
    setIsCompleted(false);
    setAllFinished(false);
    setHistory([]);
    setLastStats(null);
    setTimeout(() => {
      if (hiddenInputRef.current) hiddenInputRef.current.focus();
    }, 50);
  };

  // Average calculation for completed test
  const avgWpm = history.length ? Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length) : 0;
  const avgAccuracy = history.length ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length) : 0;
  const totalErrors = history.reduce((a, b) => a + b.errors, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              SpeedType Pro
            </h1>
            <p className="text-xs text-slate-400">Prueba de velocidad de escritura</p>
          </div>
        </div>

        <button
          onClick={restartAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 transition-all hover:text-amber-400 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reiniciar</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full my-auto" onClick={handleContainerClick}>
        {!allFinished ? (
          <div className="space-y-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span className="font-mono">
                Frase <span className="text-amber-400 font-bold">{currentSentenceIndex + 1}</span> de {SAMPLE_SENTENCES.length}
              </span>
              <span className="text-xs text-slate-500">Haz clic en el texto o empieza a escribir</span>
            </div>

            {/* Typing Box */}
            <div className="relative bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl cursor-text min-h-[160px] flex items-center transition-all focus-within:border-amber-500/50">
              {/* Hidden Controlled Input */}
              <input
                ref={hiddenInputRef}
                type="text"
                value={typedInput}
                onChange={handleInputChange}
                className="absolute opacity-0 inset-0 pointer-events-auto cursor-default"
                autoFocus
              />

              {/* Rendered Sentence with highlighted characters */}
              <div className="text-xl sm:text-3xl font-mono leading-relaxed select-none tracking-wide w-full break-words">
                {targetText.split('').map((char, idx) => {
                  const isTyped = idx < typedInput.length;
                  const isCorrect = isTyped && typedInput[idx] === char;
                  const isCurrentCursor = idx === typedInput.length;

                  let charClass = "text-slate-500";
                  if (isTyped) {
                    charClass = isCorrect ? "text-emerald-400" : "text-rose-500 bg-rose-500/10 rounded-sm";
                  }

                  return (
                    <span key={idx} className="relative inline-block">
                      {isCurrentCursor && (
                        <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-amber-400 animate-pulse rounded-full" />
                      )}
                      <span className={charClass}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Realtime Live Counter */}
            <div className="flex gap-4 justify-end text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Errores: <strong className="text-slate-200">{errorsCount}</strong></span>
              </div>
            </div>

            {/* Last Sentence Stats Banner */}
            {lastStats && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Estadísticas frase anterior #{lastStats.sentenceIndex}:</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-mono">
                  <div>
                    <span className="text-slate-500 text-xs block">WPM</span>
                    <span className="text-amber-400 font-bold">{lastStats.wpm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Precisión</span>
                    <span className="text-emerald-400 font-bold">{lastStats.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Errores</span>
                    <span className="text-rose-400 font-bold">{lastStats.errors}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Tiempo</span>
                    <span className="text-slate-300 font-bold">{lastStats.time}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Final Results Screen */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">¡Prueba Completada!</h2>
              <p className="text-sm text-slate-400">Has finalizado exitosamente las 5 frases de práctica.</p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <Gauge className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold font-mono text-slate-100">{avgWpm}</div>
                <div className="text-xs text-slate-400 mt-1">WPM Medio</div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold font-mono text-slate-100">{avgAccuracy}%</div>
                <div className="text-xs text-slate-400 mt-1">Precisión</div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <AlertCircle className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                <div className="text-2xl font-bold font-mono text-slate-100">{totalErrors}</div>
                <div className="text-xs text-slate-400 mt-1">Errores Totales</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="border-t border-slate-800 pt-6 space-y-3 text-left">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Desglose por Frase</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {history.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/50">
                    <span className="text-slate-400">Frase #{item.sentenceIndex}</span>
                    <div className="flex gap-4">
                      <span className="text-amber-400">{item.wpm} WPM</span>
                      <span className="text-emerald-400">{item.accuracy}% precision</span>
                      <span className="text-rose-400">{item.errors} err</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={restartAll}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Intentar de Nuevo</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-600 mt-8">
        Pulsa cualquier tecla para escribir. Si haces clic fuera del recuadro, vuelve a seleccionar el texto.
      </footer>
    </div>
  );
}
