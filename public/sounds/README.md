# Sonidos del juego

Esta carpeta contiene los archivos de audio utilizados en el juego.

## Archivos requeridos

- `victory.mp3` - Sonido que se reproduce cuando alguien gana (impostor o inocentes)
- `lose.mp3` - Sonido que se reproduce cuando expulsan a alguien que no es el impostor

## Formato recomendado

- **Formato**: MP3 (compatible con todos los navegadores)
- **Duración**: 2-5 segundos recomendado
- **Calidad**: 128-192 kbps es suficiente para efectos de sonido
- **Volumen**: Normalizado para evitar que sea demasiado fuerte o demasiado bajo

## Agregar un sonido

1. Coloca el archivo de audio en esta carpeta (`public/sounds/`)
2. El archivo será accesible desde la aplicación usando la ruta `/sounds/nombre-del-archivo.mp3`
3. El hook `useSound` en `src/lib/audio/use-sound.ts` maneja la reproducción

## Notas

- Los navegadores modernos requieren interacción del usuario antes de reproducir audio automáticamente
- El hook maneja errores silenciosamente si el audio no se puede reproducir
- El volumen se puede ajustar en el componente que usa el hook (rango 0.0 a 1.0)

