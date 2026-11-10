"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" disabled>
        <span className="material-icons opacity-20">dark_mode</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={`flex items-center ${className}`}
    >
      {isDark ? <span className="material-icons">light_mode</span> : <span className="material-icons">dark_mode</span>}
    </button>
  );
}
