# Pantalla 02 - Gestión de Jugadores

## Resumen

- **Propósito:** permitir al organizador administrar la lista de jugadores antes de iniciar la asignación (`RF-02`).
- **Flujo:** se invoca desde la configuración inicial; puede mostrarse como pantalla dedicada o modal a pantalla completa en mobile.
- **Historias de usuario asociadas:** `HU-02`, `HU-06`.

## Objetivos de la Pantalla

- Crear, editar, eliminar y reordenar jugadores de forma accesible y libre de duplicados.
- Sincronizar cambios con el contexto de sesión y el almacenamiento local validado.
- Informar en tiempo real el cumplimiento de la regla mínima de 4 jugadores y nombres únicos.

## Estados y Datos

- **Reducer `usePlayersReducer`:**
  - Estado base: `Player[]` donde `Player = { id: string; name: string; order: number; }`.
  - Acciones: `ADD_PLAYER`, `UPDATE_PLAYER`, `REMOVE_PLAYER`, `REORDER_PLAYERS`, `RESET_PLAYERS`.
- **Persistencia:** servicio `savePlayers` / `loadPlayers` en `src/lib/storage/players.ts` usando `localStorage`.
- **Integraciones:** hook `usePlayers` expone `[players, dispatch, meta]` donde `meta` incluye `isDirty`, `errors`.
- **Validaciones:** esquema `playerNameSchema` (`zod`) para sanitizar nombre, recortar espacios y evitar `<>`/`&`.

## Layout y Breakpoints

- **Mobile:** lista ordenable mediante controles discretos (`MoveUp`, `MoveDown` buttons) y `SwipeToDelete`.
- **Tablet:** drag & drop con `@dnd-kit` (o alternativa) activado; dos columnas (lista + formulario de edición).
- **Desktop:** tabla accesible (`<table>` semántica) con columnas `Jugador`, `Acciones`, `Orden`.
- Uso de tarjetas `Card` para agrupar lista y formulario; mantener botón primario fijo inferior para confirmar cambios.

## Componentes Clave

- `PlayerList`: renderiza colección con `PlayerRow`.
- `PlayerRow`: incluye `Input` inline, botones `Edit`, `Delete`, `DragHandle`.
- `PlayerForm`: formulario para añadir/editar con `TextField`, validación instantánea y CTA `Guardar`.
- `PlayersToolbar`: muestra contador, alertas y CTA `Limpiar lista`.
- `DialogConfirm`: modal reutilizable para confirmar eliminaciones.

## Validaciones y Mensajes

- Nombres deben ser únicos (case-insensitive); mostrar `InlineError` bajo el campo afectado.
- Longitud de nombre: 1-24 caracteres tras sanitizar; prohibir cadenas vacías o solo espacios.
- Al intentar cerrar con <4 jugadores, mostrar `Alert` persistente indicando la regla mínima.
- Confimar eliminación con mensaje “¿Eliminar a {nombre}? Esta acción no se puede deshacer.”

## Flujo de Interacción

1. Al entrar, se cargan jugadores persistidos (`loadPlayers`) y se muestran ordenados.
2. El organizador agrega/edita nombres; cada acción despacha al reducer y actualiza `localStorage` mediante efecto controlado.
3. El botón `Guardar y volver` sincroniza estado con `GameSessionContext` y navega a `Pantalla 01`.
4. Si se alcanza un estado válido (≥4 únicos), se muestra `BannerSuccess` confirmando disponibilidad para iniciar.

## Accesibilidad

- Drag & drop debe ofrecer alternativas con teclado (`Space` para pick, `ArrowUp/Down` para mover).
- Anunciar cambios en el orden mediante `aria-live="polite"`.
- Botones con iconos deben incluir `aria-label`.
- Mantener contraste mínimo 4.5:1 con la paleta principal definida.

## Métricas y Telemetría

- Evento `players_update` con payload `{ total, duplicatesResolved }`.
- Registrar incidencias de validación (`players_error`) diferenciando `duplicate`, `min_required`.

## Dependencias y Navegación

- En ruta dedicada (`/players`) o modal controlado; regreso a `Pantalla 01` mediante `Router.back()` o cierre de modal.
- Acceso opcional desde menú lateral en desktop.

## Consideraciones Técnicas

- Reducer y validaciones deben residir en `src/lib/players/`.
- Evitar mutar arreglos directamente (usar `arrayMove` o `Array.from`).
- Probar reducer con `Vitest` incluyendo casos de duplicados y reordenamiento.
- Asegurar que el estado se sincroniza antes de desmontar el componente (efecto `useEffect` con dependencias estables).
