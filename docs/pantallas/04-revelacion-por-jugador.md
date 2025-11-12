# Pantalla 04 - Revelación por Jugador

## Resumen

- **Propósito:** presentar palabra o rol de impostor de manera privada a cada jugador (`RF-05`).
- **Flujo:** secuencia iterativa controlada por el organizador, recorriendo `revealOrder` hasta completar todos los jugadores.
- **Historias de usuario asociadas:** `HU-04`, `HU-05`.

## Objetivos de la Pantalla

- Mostrar información individual de forma clara y a pantalla completa, evitando filtraciones entre jugadores.
- Guiar la entrega del dispositivo con pasos explícitos (`handoff`, `reveal`) antes de avanzar al siguiente.
- Respetar el orden definido en `AssignmentState.revealOrder`.
- Permitir pausar/reanudar la secuencia sin perder el progreso.

## Estados y Datos

- **Estado local (`useRevelationState`):**
  - `currentIndex: number`
  - `revealedPlayers: Set<Player['id']>`
  - `phase: "handoff" | "reveal"`
- **Datos de contexto:** `currentAssignment` desde `GameSessionContext`.
- **Parametros:** `players` con nombres sanitizados; `word` e `impostorId`.
- **Persistencia:** no se guarda en almacenamiento local; estado vive en memoria durante la sesión.

## Layout y Breakpoints

- **Mobile:** pantalla completa con tipografía grande (`text-display`), botón primario `Listo`, botón secundario `Mostrar de nuevo`.
- **Tablet y Desktop:** mantener centro alineado, incluir panel lateral (tips) solo en desktop `≥1024px`.
- Fondo configurable con gradientes suaves que mantengan contraste AA.

## Componentes Clave

- `RevelationScreen`: contenedor general (cliente) que controla navegación y fases.
- `HandoffScreen`: pantalla de transferencia que muestra “Pasa el dispositivo a {nombre}” con CTA primario `Estoy listo`.
- `RoleCard`: destaca palabra o etiqueta `IMPOSTOR` con estilos diferenciados.
- `PlayerStepper`: indicador de progreso (ej. “Jugador 3 de 8”) con `ProgressBar`.
- `ActionFooter`: agrupa botones primario y secundarios cuando `phase === "reveal"`.

## Validaciones y Mensajes

- Si `currentAssignment` es nulo, redirigir a `Pantalla 01`.
- Mostrar alerta si la secuencia detecta inconsistencias (`revealOrder` sin jugador existente).
- Mensajes deben evitar revelar la palabra cuando el jugador es impostor (“Tu rol es: IMPOSTOR”).

## Flujo de Interacción

1. La pantalla carga el jugador actual según `currentIndex` y muestra `HandoffScreen` (`phase === "handoff"`) con mensaje “Pasa el dispositivo a {nombre}”.
2. El jugador pulsa `Estoy listo`; el estado cambia a `phase === "reveal"` y se muestra la `RoleCard` con botones `Mostrar de nuevo` y `Terminé`.
3. Al seleccionar `Terminé`, la tarjeta se oculta inmediatamente y `useRevelationState` incrementa `currentIndex`, registra al jugador en `revealedPlayers` y vuelve a `phase === "handoff"` para el siguiente jugador.
4. Si `currentIndex` alcanza el total, se navega automáticamente a `Pantalla 05 - ¡A jugar!`.

## Accesibilidad

- Implementar `aria-live` para anunciar cambios de jugador en `HandoffScreen` (“Turno de {nombre}”).
- Controlar foco entre botones primarios según la fase; tras pulsar `Terminé` el foco se mueve a `Estoy listo` del siguiente turno.
- Evitar depender solo del color para diferenciar roles; incluir etiquetas textuales claras.
- Incluir soporte para navegación por teclado (Enter activa CTA en la fase actual; Esc cancela diálogos como el de “Volver a resumen”).

## Métricas y Telemetría

- Evento `revelation_start` al entrar en la pantalla.
- Evento `revelation_handoff` con `{ playerId }` cuando se muestra la pantalla de transferencia.
- Evento `revelation_reveal` con `{ playerId, isImpostor }` al mostrar la tarjeta.
- Evento `revelation_step` con `{ playerId, isImpostor }` al avanzar al siguiente jugador.
- Evento `revelation_cancel` si se vuelve atrás antes de completar o se reinicia el flujo.

## Dependencias y Navegación

- Proviene de `Pantalla 03`.
- Avanza internamente hasta `Pantalla 05`.
- CTA secundaria `Volver a resumen` para regresar a `Pantalla 03` (limpia estado de revelación y requiere confirmación).

## Consideraciones Técnicas

- Mantener hooks puros en `src/lib/revelation/` y exponer helpers en `useRevelationState`:
  - `startReveal()` → coloca `phase` en `"reveal"` y muestra la tarjeta.
  - `showAgain()` → refuerza la fase de revelado sin avanzar el índice.
  - `completeReveal()` → avanza índice, registra jugador y vuelve a `"handoff"`.
  - `reset()` → restablece el flujo cuando cambia la asignación.
- Tests unitarios para `useRevelationState` cubriendo:
  - Avance secuencial correcto y preservación de fases.
  - Manejo de duplicados.
  - Reinicio tras cancelar/volver atrás.
- Documentar stories (`handoff`, `reveal`) en Storybook con `@storybook/addon-a11y`.
- Garantizar que el componente se marque como `use client` y utilice `Framer Motion` para transiciones suaves entre fases (respetando `prefers-reduced-motion`).
