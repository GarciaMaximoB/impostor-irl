# Pantalla 05 - ¡A Jugar!

## Resumen
- **Propósito:** cerrar la secuencia de revelación, confirmar que todos los jugadores conocen su rol y ofrecer controles para iniciar una nueva ronda (`RF-06`, `RF-07`).
- **Flujo:** se muestra automáticamente tras completar la revelación; actúa como hub entre rondas.
- **Historias de usuario asociadas:** `HU-05`, `HU-06`.

## Objetivos de la Pantalla
- Comunicar claramente que la asignación terminó y que comienza la fase presencial.
- Ofrecer CTA para `Siguiente ronda` reutilizando configuraciones actuales.
- Permitir regresar a la configuración para cambios mayores (jugadores, categoría).

## Estados y Datos
- **Contexto de sesión:**
  - `currentAssignment` se mantiene hasta que se lance nueva ronda o se resetee.
  - `settings` y `players` permanecen disponibles para reutilizar.
- **Temporal:** indicador `roundsPlayed` (opcional) incrementado al completar asignación.

## Layout y Breakpoints
- **Mobile:** diseño centrado con titular “¡A jugar!” y botones apilados (`Siguiente ronda`, `Volver a configuración`).
- **Tablet/Desktop:** incluir panel lateral con recordatorio de palabra (solo visible para organizador con toggle) y tips de moderación.
- Uso de animaciones con `Framer Motion` para celebrar final de asignación (p.ej., fade-in + confetti discreto).

## Componentes Clave
- `FinalCallout`: componente hero con mensaje principal y subtítulo.
- `RoundActions`: grupo de botones:
  - `Button` primario `Siguiente ronda`.
  - `Button` secundario `Editar configuración`.
- `WordRevealToggle`: control opcional para mostrar/ocultar palabra al organizador (no exponer a participantes).
- `RoundSummary`: lista rápida con total de jugadores e impostor (solo etiqueta, sin nombre) para evitar spoilers.

## Validaciones y Mensajes
- Si se detecta que algún jugador no completó la revelación, redirigir a `Pantalla 04`.
- Confirmar al lanzar `Siguiente ronda` que se sobrescribirá la palabra anterior.
- Mensaje contextual: “Mantén el dispositivo oculto mientras juega el grupo”.

## Flujo de Interacción
1. Pantalla recibe `currentAssignment` completado y marca `roundsPlayed += 1`.
2. Si el organizador pulsa `Siguiente ronda`, se ejecuta:
   - Reset de `currentAssignment`.
   - Navegación a `Pantalla 03` para generar nuevo sorteo con mismos jugadores y categoría.
3. Seleccionar `Editar configuración` redirige a `Pantalla 01` sin modificar preferencias persistidas.
4. `Cerrar sesión` (si se implementa) limpia almacenamiento local y retorna a inicio.

## Accesibilidad
- Mensaje principal debe ser texto real (no solo ilustración).
- Botones con foco visible.
- Toggle de palabra debe anunciar en `aria-live` si se muestra u oculta.
- Mantener contraste y tamaño mínimo de 44px en botones.

## Métricas y Telemetría
- Evento `round_complete` con `{ playersCount, elapsedMs }`.
- Evento `round_next` al iniciar nueva ronda.
- Evento `round_config_edit` si se decide modificar ajustes.

## Dependencias y Navegación
- Llega desde `Pantalla 04` una vez completada la secuencia.
- CTA primario vuelve a `Pantalla 03`; secundario a `Pantalla 01`.
- Links informativos hacia `Pantalla 06 - Administración de Categorías` para ajustes rápidos.

## Consideraciones Técnicas
- Guardar `roundsPlayed` en contexto para posibles estadísticas futuras (mantener módulo puro en `src/lib/session/`).
- Asegurar que `Siguiente ronda` no persista palabra ni impostor previos.
- Tests: validar que el flujo de `Siguiente ronda` reusa jugadores y categoría, y que `currentAssignment` se limpia.


