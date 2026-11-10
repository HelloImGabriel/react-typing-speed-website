import { CheckCircle2, AlertCircle } from "lucide-react";


export default function SentenceResult({ lastStats, finishSentence }: { lastStats: any, finishSentence: (finishTime: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-primary-900/40 border border-primary/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Resultado frase anterior (Frase #{lastStats.sentenceIndex}):
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono">
          <div>
            <span className="text-xs block">WPM</span>
            <span className="font-bold">
              {lastStats.wpm}
            </span>
          </div>
          <div>
            <span className="text-xs block">Precisión</span>
            <span className="font-bold">
              {lastStats.accuracy}%
            </span>
          </div>
          <div>
            <span className="text-xs block">Errores</span>
            <span className="text-rose-400 font-bold">
              {lastStats.errors}
            </span>
          </div>
          <div>
            <span className="text-xs block">Tiempo</span>
            <span className="font-bold">
              {lastStats.time}s
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-end text-xs font-mono">

        {/* Debug: button skip to next sentence */}
        <button type="button" className="px-3 py-1.5 rounded-lg border border-primary" onClick={() => { finishSentence(Date.now()) }}>Go Next</button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>
            Errores en frase actual:{" "}
            <strong className="">{lastStats.errors}</strong>
          </span>
        </div>
      </div>

    </div>
  )
}
