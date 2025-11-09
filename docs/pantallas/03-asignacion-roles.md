# Pantalla 03 - Asignación de Roles

## Resumen
- **Propósito:** ejecutar y confirmar la lógica de selección de palabra e impostor antes de iniciar la revelación (`RF-03`, `RF-04`).
- **Flujo:** pantalla intermedia tras la configuración válida; muestra resumen de datos y permite lanzar la secuencia de revelado.
- **Historias de usuario asociadas:** `HU-03`, `HU-05`.

## Objetivos de la Pantalla
- Mostrar al organizador un resumen revisable de jugadores, categoría y configuraciones seleccionadas.
- Ejecutar `assignRoles({ players, category })` y almacenar resultado en el contexto de sesión.
- Permitir reiniciar el sorteo en caso de cambios (manteniendo auditoría mínima de intentos).

## Estados y Datos
- **Resultado de asignación (`AssignmentState`):**
  - `word: string`
  - `impostorId: Player['id']`
  - `revealOrder: Player['id'][]`
  - `timestamp: number`
- **Contexto:** se guarda en `GameSessionContext` bajo `currentAssignment`.
- **Dependencias puras:** módulo `src/lib/game/assignRoles.ts` (usa `crypto.getRandomValues`).
- **Metadatos:** contador `rerolls` para controlar reintentos manuales (límite recomendado: 3).

## Layout y Breakpoints
- **Mobile:** tarjeta resumen (`Card`) con secciones plegables para jugadores y categoría; botón primario `Comenzar revelación`.
- **Tablet:** dos columnas (resumen + panel de acciones/reintentos).
- **Desktop:** grilla con panel lateral que incluye historial de reintentos y tips de moderación (texto).

## Componentes Clave
- `AssignmentSummary`: lista jugadores en orden de revelación (`revealOrder`).
- `AssignmentControls`: CTA primario (`Button`), CTA secundaria `Rehacer sorteo`.
- `InfoBanner`: mensajes informativos (ej. “Cada jugador verá su palabra en privado. Pasa el dispositivo en este orden.”).
- `DangerZone` condicional para limpiar sesión (`ResetAssignmentButton`).

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

## Métricas y Telemetría
- Evento `assignment_generated` con `{ playersCount, categoryId }`.
- Evento `assignment_reroll` con `{ rerollIndex }` para medir reintentos.

## Dependencias y Navegación
- Se accede desde `Pantalla 01` una vez válidas las precondiciones.
- Navegación principal hacia `Pantalla 04`.
- CTA secundaria para volver a `Pantalla 01` y editar configuración (invalida el assignment actual).

## Consideraciones Técnicas
- `assignRoles` debe ser determinista en tests usando `seedrandom`.
- Guardar `currentAssignment` exclusivamente en memoria (no persistir en almacenamiento local).
- Al desmontar la pantalla sin confirmar, decidir si se limpia el assignment para evitar inconsistencias (por defecto, sí).
- Escribir pruebas unitarias para confirmar:
  - Se selecciona exactamente un impostor.
  - `revealOrder` contiene todos los jugadores sin duplicados.
  - La palabra pertenece a la categoría seleccionada (o mezcla en `Random`).

