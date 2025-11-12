# Pantalla 04 - Revelación por Jugador

## Resumen
- **Propósito:** presentar palabra o rol de impostor de manera privada a cada jugador (`RF-05`).
- **Flujo:** secuencia iterativa controlada por el organizador, recorriendo `revealOrder` hasta completar todos los jugadores.
- **Historias de usuario asociadas:** `HU-04`, `HU-05`.

## Objetivos de la Pantalla
- Mostrar información individual de forma clara y a pantalla completa.
- Gestionar navegación entre jugadores, incluyendo “Mostrar de nuevo” y confirmación antes de continuar.
- Respetar el orden definido en `AssignmentState.revealOrder`.
- Permitir pausar/reanudar la secuencia sin perder el progreso.

## Estados y Datos
- **Estado local (`useRevelationState`):**
  - `currentIndex: number`
  - `revealedPlayers: Set<Player['id']>`
  - `showConfirmation: boolean`
- **Datos de contexto:** `currentAssignment` desde `GameSessionContext`.
- **Parametros:** `players` con nombres sanitizados; `word` e `impostorId`.
- **Persistencia:** no se guarda en almacenamiento local; estado vive en memoria durante la sesión.

## Layout y Breakpoints
- **Mobile:** pantalla completa con tipografía grande (`text-display`), botón primario `Listo`, botón secundario `Mostrar de nuevo`.
- **Tablet y Desktop:** mantener centro alineado, incluir panel lateral (tips) solo en desktop `≥1024px`.
- Fondo configurable con gradientes suaves y opción de alto contraste (tokens alternativos).

## Componentes Clave
- `RevelationScreen`: contenedor general (cliente) que controla navegación.
- `RoleCard`: destaca palabra o etiqueta `IMPOSTOR` con estilos diferenciados.
- `PlayerStepper`: indicador de progreso (ej. “Jugador 3 de 8”) con `ProgressBar`.
- `ConfirmationModal`: confirma antes de avanzar al siguiente jugador.
- `ActionFooter`: agrupa botones primario y secundarios.

## Validaciones y Mensajes
- Si `currentAssignment` es nulo, redirigir a `Pantalla 01`.
- Mostrar alerta si la secuencia detecta inconsistencias (`revealOrder` sin jugador existente).
- Mensajes deben evitar revelar la palabra cuando el jugador es impostor (“Tu rol es: IMPOSTOR”).
- Confirmación: “¿{nombre} ya vio su rol? Esta acción no se puede deshacer.”

## Flujo de Interacción
1. La pantalla carga el jugador actual según `currentIndex`.
2. El organizador muestra la palabra al jugador y pulsa `Mostrar de nuevo` si es necesario (no avanza índice).
3. Al seleccionar `Listo`, aparece `ConfirmationModal`. Confirmar incrementa `currentIndex` y añade jugador a `revealedPlayers`.
4. Si `currentIndex` alcanza el total, se navega automáticamente a `Pantalla 05 - ¡A jugar!`.

## Accesibilidad
- Implementar `aria-live` para anunciar cambios de jugador.
- Controlar foco: al abrir `ConfirmationModal`, mover foco al botón confirmatorio.
- Para modo alto contraste, evitar depender solo del color para diferenciar roles (incluir etiquetas textuales).
- Incluir soporte para navegación por teclado (Enter = `Listo`, Esc = cancelar modal).

## Métricas y Telemetría
- Evento `revelation_start` al entrar en la pantalla.
- Evento `revelation_step` con `{ playerId, isImpostor }`.
- Evento `revelation_cancel` si se vuelve atrás antes de completar.

## Dependencias y Navegación
- Proviene de `Pantalla 03`.
- Avanza internamente hasta `Pantalla 05`.
- CTA secundaria `Volver a resumen` para regresar a `Pantalla 03` (limpia estado de revelación y requiere confirmación).

## Consideraciones Técnicas
- Mantener hooks puros en `src/lib/revelation/`.
- Tests unitarios para `useRevelationState` cubriendo:
  - Avance secuencial correcto.
  - Manejo de duplicados.
  - Reinicio tras cancelar.
- Garantizar que el componente se marque como `use client` y utilice `Framer Motion` para transiciones suaves entre jugadores (respetando performance).


