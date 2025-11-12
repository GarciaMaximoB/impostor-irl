# Pantalla 03 - Asignación de Roles

## Resumen

- **Propósito:** ejecutar y validar la logística previa a la revelación sin exponer la palabra ni el impostor (`RF-03`, `RF-04`).
- **Flujo:** pantalla intermedia tras la configuración válida; presenta un resumen non-sensible y permite iniciar la secuencia de revelado jugador por jugador.
- **Historias de usuario asociadas:** `HU-03`, `HU-05`.

## Objetivos de la Pantalla

- Presentar un resumen revisable de jugadores, categoría y configuraciones sin revelar la palabra asignada ni la identidad del impostor.
- Ejecutar `assignRoles({ players, category })`, almacenar el resultado en el contexto de sesión y mantenerlo oculto hasta la pantalla de revelado.
- Permitir reiniciar el sorteo en caso de cambios (manteniendo auditoría mínima de intentos) sin mostrar resultados parciales.

## Estados y Datos

- **Resultado de asignación (`AssignmentState`):**
  - `word: string`
  - `impostorId: Player['id']`
  - `revealOrder: Player['id'][]`
  - `timestamp: number`
- **Contexto:** se guarda en `GameSessionContext` bajo `currentAssignment`; la UI de esta pantalla nunca debe renderizar `word` ni `impostorId`.
- **Dependencias puras:** módulo `src/lib/game/assignRoles.ts` (usa `crypto.getRandomValues`).
- **Metadatos:** contador `rerolls` para controlar reintentos manuales (límite recomendado: 3).

## Layout y Breakpoints

- **Mobile:** tarjeta resumen (`Card`) con secciones plegables para jugadores y categoría (sin revelar palabra); botón primario `Comenzar revelación`.
- **Tablet:** dos columnas (resumen + panel de acciones/reintentos) manteniendo toda información sensible oculta.
- **Desktop:** grilla con panel lateral que incluye historial de reintentos y tips de moderación (texto), recordando que nadie ve la palabra hasta su turno.

## Componentes Clave

- `AssignmentSummary`: lista jugadores en orden de revelación (`revealOrder`) y detalla configuración sin exponer `word` ni `impostorId`.
- `AssignmentControls`: CTA primario (`Button`), CTA secundaria `Rehacer sorteo`, controles discretos para manejar reintentos.
- `InfoBanner`: mensajes informativos (ej. “Nadie conoce la palabra todavía. Entrega el dispositivo en este orden.”).
- `DangerZone` condicional para limpiar sesión (`ResetAssignmentButton`) sin mostrar datos sensibles.

## Validaciones y Mensajes

- Antes de ejecutar asignación, verificar de nuevo precondiciones (`players` ≥4, categoría con palabras).
- En caso de error en `assignRoles` (p. ej., sin palabras disponibles), mostrar `Alert` con acción hacia administración de categorías.
- Limitar `rerolls` y, al exceder, mostrar mensaje “Has alcanzado el máximo de resorteos recomendados. Revisa la configuración si necesitas cambiar datos.”
- Confirmar reinicio completo con modal (`headlessui/Dialog`) para evitar pérdida accidental.

## Flujo de Interacción

1. Al montar, si `currentAssignment` está vacío, ejecutar `assignRoles` automáticamente.
2. Mostrar resumen con orden de revelación resultante.
3. El organizador confirma y navega a `Pantalla 04 - Revelación por Jugador`.
4. Si reintenta, se incrementa `rerolls`, se ejecuta nuevamente `assignRoles` (con nueva palabra/impostor) y se actualiza el resumen.

## Accesibilidad

- Orden de lectura debe coincidir con `revealOrder`.
- Botones con iconos (`Retry`) requieren `aria-label`.
- Para mensajes críticos usar `role="alert"`.
- Evitar textos o atributos que sugieran que alguien ya conoce la palabra; reforzar instrucciones de ocultar la pantalla entre turnos.

## Métricas y Telemetría

- Evento `assignment_generated` con `{ playersCount, categoryId }`.
- Evento `assignment_reroll` con `{ rerollIndex }` para medir reintentos.
- Evitar registrar en telemetría la palabra o la identidad del impostor (sensibles).

## Dependencias y Navegación

- Se accede desde `Pantalla 01` una vez válidas las precondiciones.
- Navegación principal hacia `Pantalla 04`.
- CTA secundaria para volver a `Pantalla 01` y editar configuración (invalida el assignment actual).
- El dispositivo lo manipula cualquier jugador; el flujo está diseñado para que nadie vea la palabra antes de su turno.

## Consideraciones Técnicas

- `assignRoles` debe ser determinista en tests usando `seedrandom`.
- Guardar `currentAssignment` exclusivamente en memoria (no persistir en almacenamiento local).
- Al desmontar la pantalla sin confirmar, decidir si se limpia el assignment para evitar inconsistencias (por defecto, sí); el estado se re-generará sin exponer `word` ni `impostorId`.
- Escribir pruebas unitarias para confirmar:
  - Se selecciona exactamente un impostor.
  - `revealOrder` contiene todos los jugadores sin duplicados.
  - La palabra pertenece a la categoría seleccionada (o mezcla en `Random`).
  - La UI de esta pantalla nunca renderiza `word` ni `impostorId` aun cuando existan en `AssignmentState`.
