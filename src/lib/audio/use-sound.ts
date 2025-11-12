"use client";

import { useEffect, useRef } from "react";

/**
 * Hook para reproducir sonidos de forma controlada.
 * Maneja la creación y limpieza del elemento de audio.
 *
 * @param soundPath - Ruta al archivo de sonido (relativa a /public)
 * @param options - Opciones de reproducción
 * @returns Función para reproducir el sonido manualmente
 */
export function useSound(
  soundPath: string | null,
  options: {
    volume?: number;
    playOnMount?: boolean;
  } = {}
): () => void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume = 0.7, playOnMount = false } = options;

  // Crear el elemento de audio una sola vez
  useEffect(() => {
    if (!soundPath) {
      return;
    }

    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume));
    audioRef.current = audio;

    return () => {
      // Limpiar el elemento de audio al desmontar
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundPath, volume]);

  // Reproducir automáticamente al montar si está habilitado
  useEffect(() => {
    if (playOnMount && audioRef.current) {
      audioRef.current.play().catch((error) => {
        // Silenciar errores de reproducción (puede fallar si el usuario no ha interactuado)
        console.warn("No se pudo reproducir el sonido:", error);
      });
    }
  }, [playOnMount]);

  // Función para reproducir el sonido manualmente
  return () => {
    if (audioRef.current) {
      // Reiniciar el sonido desde el principio si ya se estaba reproduciendo
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn("No se pudo reproducir el sonido:", error);
      });
    }
  };
}
