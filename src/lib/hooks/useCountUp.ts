"use client";

/*
 * Commentaires de structure : Anime progressivement une valeur numerique pour les blocs statistiques.
 */
import { useState, useEffect, useRef } from "react";

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export function useCountUp(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;

    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);

  return count;
}
