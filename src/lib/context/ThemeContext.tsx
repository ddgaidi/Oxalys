"use client";

/*
 * Commentaires de structure : Gere le theme clair/sombre et expose le contexte a toute l application.
 */
import { createContext, useContext, useEffect, useState } from "react";

// Type local : limite les valeurs possibles et securise les branches de logique.
type Theme = "dark" | "light";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("oxalys_theme") as Theme | null;
    const preferred = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
  }, []);

// Helper interne : isole une transformation ou une regle metier du rendu principal.
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("oxalys_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
