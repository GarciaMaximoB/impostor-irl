# Pantalla 01 - Configuración de Partida

## Resumen

- **Propósito:** agrupar la configuración inicial de la partida (`RF-01`) y preparar el contexto de sesión antes de iniciar la asignación.
- **Flujo:** primer contacto del organizador tras cargar la app; desde aquí se navega hacia la gestión de jugadores y se lanza la asignación.
- **Historias de usuario asociadas:** `HU-01`, `HU-06`.

## Objetivos de la Pantalla

- Capturar nombre opcional de sala, categoría activa o modo `Random`.
- Exponer acceso a la gestión de jugadores sin abandonar el flujo principal.
- Persistir preferencias ligeras en `localStorage` (categoría y orden de jugadores) mediante servicios validados con `zod`.
- Validar precondiciones mínimas (≥4 jugadores, categoría con palabras disponibles) antes de habilitar el inicio.

## Estados y Datos

- **Contexto de sesión (`GameSessionContext`):**
  - `settings`: `{ roomName?: string; categoryId: string; }`
  - `players`: lista proveniente de `usePlayersReducer`.
  - `status`: `idle | ready | assigning | completed`.
- **Persistencia local:**
  - `localStorage` clave `impostor:lastSettings` (sincronizada vía servicio puro `loadLastSettings` / `saveLastSettings` en `src/lib/storage/settings.ts`).
  - Acceso dentro de `useEffect` controlado, aislado en hook `usePersistedSettings`.
- **Acciones de reducer relevantes:**
  - `SET_SETTINGS`, `RESTORE_SETTINGS`, `RESET_SETTINGS`.
- **Fuentes externas:** catálogo de categorías (`src/lib/data/categories.json`) cargado mediante módulo puro y validado con `zod`.

## Layout y Breakpoints

- **Mobile (≤375px):** layout en columna; secciones plegables (`Accordion`) para sala y categoría; botón primario fijo en footer.
- **Tablet (768px):** dos columnas: configuración general izquierda, resumen de jugadores derecha.
- **Desktop (≥1024px):** grilla `grid-cols-[minmax(280px,320px)_minmax(320px,1fr)]`, panel lateral para ayuda contextual y CTA secundaria hacia categorías.
- Utilizar tokens de `Tailwind` definidos en `tailwind.config.js`; clases combinadas con `clsx`.

## Componentes Clave

- `ConfigurationForm` (componente cliente, carpeta `src/app/(components)/ConfigurationForm`):
  - Campos: `TextField` para nombre de sala, `Select` para categoría, `Toggle` para modo alto contraste.
  - Emite `onSubmit(settings)` y dispara validación con `zod` (`settingsSchema`).
- `PlayersSummaryCard`: muestra total de jugadores, advertencias si <4.
- `PrimaryCTA` (`Button` primario) etiquetado `Iniciar asignación`.
- Acceso a `Gestión de jugadores` mediante CTA secundaria (`Button variant="ghost"` o `LinkButton`).
- `EmptyState` reutilizable si no hay categorías cargadas (llama a flujo de administración).

## Validaciones y Mensajes

- Validar nombre de sala (longitud ≤40, sin caracteres no permitidos) con `zod` y sanitizar espacios redundantes.
- Comprobar lista de jugadores única y ≥4; si falla, mostrar alerta en `PlayersSummaryCard` (`Alert` accesible).
- Verificar que la categoría seleccionada contenga palabras activas; en caso contrario, modal informativo con opción a abrir administrador de categorías.
- Mensajes orientados a acción (ej. “Agrega al menos 4 jugadores para comenzar”).

## Flujo de Interacción

1. La pantalla monta `usePersistedSettings` → restaura ajustes si existen.
2. El organizador ingresa datos y confirma.
3. Al enviar, `assignRolesGuard` valida precondiciones (`players`, `category`).
4. Si válido, se actualiza `GameSessionContext` → `status` pasa a `ready` y se redirige a `Pantalla 03 - Asignación de Roles`.

## Accesibilidad

- Etiquetas `aria-label` en controles; `FormField` con `aria-describedby` hacia mensajes de error.
- Focus management al abrir modales (trabajar con `headlessui/Dialog` si se necesita).
- Modo alto contraste adaptando tokens (ver `docs/especificaciones-tecnicas.md`).

## Métricas y Telemetría

- Evento `config_submit` con payload `{ categoryId, playersCount }` (registrado si se integra `Vercel Analytics`).
- Medir tiempo desde carga hasta envío (`performance.now()` dentro de hook `useConfigAnalytics`).

## Dependencias y Navegación

- Inicia el flujo principal (`/`).
- CTA secundaria hacia `Pantalla 02 - Gestión de Jugadores` (`/players` o modal embebido).
- Enlace contextual a `Pantalla 06 - Administración de Categorías`.

## Consideraciones Técnicas

- Mantener lógica de validación en `src/lib/validation/settings.ts`.
- No acceder directamente a APIs del navegador desde componentes de servidor; el formulario es `use client`.
- Asegurar sincronización entre `GameSessionContext` y almacenamiento local únicamente cuando el usuario confirma.
- Pruebas unitarias: validar `settingsSchema`, `usePersistedSettings` y guardas de asignación (`Vitest`).
