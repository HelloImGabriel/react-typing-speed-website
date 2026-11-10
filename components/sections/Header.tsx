import {
  RefreshCw,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

export default function Header() {
  return (
    <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 border border-primary/30 dark:border-foreground/20 rounded-xl text-primary dark:text-foreground">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            SpeedType Pro
          </h1>
          <p className="text-xs text-foreground/70">
            Prueba de velocidad de escritura (Modo Infinito)
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <ThemeToggle className="text-primary" />

        {/* onClick={restartAll} */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/80 hover:bg-primary rounded-xl text-white transition-all hover:text-white active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reiniciar Sesión</span>
        </button></div>
    </header>
  )
}
