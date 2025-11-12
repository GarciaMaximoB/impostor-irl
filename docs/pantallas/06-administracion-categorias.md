# Pantalla 06 - Administración de Categorías

## Resumen

- **Propósito:** permitir CRUD básico de categorías y palabras locales (`RF-08`), alineado con datos locales definidos en `docs/especificaciones-tecnicas.md`.
- **Flujo:** accesible desde configuración inicial o menú secundario; puede operar como sección independiente (`/categories`).
- **Historias de usuario asociadas:** `HU-01` (validación de palabras disponibles), extensión futura del backlog.

## Objetivos de la Pantalla

- Visualizar categorías existentes, estado (activa/inactiva) y conteo de palabras.
- Permitir crear/editar categorías con validación `zod` antes de persistir en `IndexedDB` vía `idb-keyval`.
- Ofrecer importación/exportación manual (cuando esté disponible) respetando reglas de sanitización.
- Garantizar que solo categorías válidas estén disponibles para `Random`.

## Estados y Datos

- **Hook `useCategoriesStore`:**
  - `categories: Category[]`
  - `selectedCategoryId?: string`
  - `status: 'idle' | 'loading' | 'editing' | 'error'`
  - Acciones: `LOAD`, `CREATE`, `UPDATE`, `DELETE`, `TOGGLE_ACTIVE`, `IMPORT`, `EXPORT`.
- **Persistencia:** `IndexedDB` (`idb-keyval`) con clave `impostor:categories`; fallback leyendo `src/lib/data/categories.json`.
- **Validaciones:** `categorySchema`, `wordSchema`, `categoryPayloadSchema` (uso `zod`, sanitiza mayúsculas/minúsculas y espacios).

## Layout y Breakpoints

- **Mobile:** lista de tarjetas por categoría con CTA `Editar`; panel deslizante (`Sheet`) para formulario.
- **Tablet:** layout maestro-detalle (lista izquierda, detalle/tabla de palabras derecha).
- **Desktop:** grilla con filtros rápidos, tabla de palabras (`DataTable` accesible) y barra lateral con estadísticas.
- Incluir barra de búsqueda y filtros por estado.

## Componentes Clave

- `CategoryList`: lista virtualizada si >20 categorías.
- `CategoryForm`: formulario controlado con campos `name`, `description`, `isActive`, lista editable de palabras.
- `WordListEditor`: permite agregar/editar/eliminar palabras con validación inline.
- `ImportExportPanel`: (roadmap cercano) botones para manejar archivos `.json`.
- `EmptyState`: guía para crear primera categoría si no existen datos.

## Validaciones y Mensajes

- Nombres de categoría únicos (case-insensitive), longitud 3-40 caracteres.
- Cada palabra debe tener longitud 2-30, sin caracteres no permitidos; se sanitiza y se recorta.
- Al desactivar una categoría, mostrar confirmación indicando que no aparecerá en selección ni en Random.
- Manejar errores de `IndexedDB` con mensajes descriptivos (ej. “No pudimos guardar cambios. Verifica el espacio disponible en el dispositivo.”).

## Flujo de Interacción

1. Al montar, `useCategoriesStore` intenta cargar desde `IndexedDB`; si falla, recurre a datos estáticos validados.
2. Crear/editar categoría abre formulario; al guardar, se valida con `zod` y se persiste.
3. Cambios exitosos emiten evento `categories_updated` y notifican a `GameSessionContext` para refrescar selector en `Pantalla 01`.
4. Eliminar requiere confirmación doble, evitando borrar categorías usadas en la sesión actual.

## Accesibilidad

- Formularios con `label` asociado y feedback en `aria-describedby`.
- Listas extensas deben ser navegables con teclado (foco cíclico).
- Indicar status (`loading`, `error`) mediante regiones `aria-live`.
- Botones de importación/exportación deben describir su efecto completo.

## Métricas y Telemetría

- Evento `category_create`, `category_update`, `category_delete` con metadata `{ wordsCount }`.
- Evento `category_toggle` para controlar adopción del modo activo/inactivo.
- Registrar fallos de persistencia (`category_persist_error`).

## Dependencias y Navegación

- Acceso desde `Pantalla 01` y `Pantalla 05`.
- Tras guardar cambios se retorna opcionalmente a pantalla previa o se mantiene en vista actual según elección del usuario.
- Exponer ayuda contextual hacia `docs/vision-funcional.md` sección “Administrar categorías locales”.

## Consideraciones Técnicas

- Mantener servicios de persistencia en `src/lib/storage/categories.ts` con funciones puras.
- Encapsular acceso a `IndexedDB` en `try/catch` para degradar elegantemente a datos estáticos.
- Implementar pruebas para:
  - Validaciones de esquemas (`categorySchema`, `wordSchema`).
  - Reducer de `useCategoriesStore`.
  - Persistencia (mock de `idb-keyval`).
- Asegurar que exportaciones (cuando existan) incluyan metadatos de versión para futura compatibilidad.
