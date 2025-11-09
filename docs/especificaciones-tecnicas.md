# Especificaciones Técnicas

## Arquitectura General
- **Tipo de aplicación:** SPA híbrida sobre `Next.js` (App Router) desplegada en Vercel, con renderizado estático y énfasis en lógica cliente.
- **Lenguaje principal:** `TypeScript` con modo estricto (`strict: true`) para garantizar tipado fuerte y favorecer funciones puras.
- **Patrón organizacional:** composición de módulos funcionales (hook + función pura) para separar UI, lógica de dominio y servicios de persistencia local.
- **Gestión de estado:** React context minimalista para la sesión de partida y `useReducer` con acciones puras; evitar librerías de estado global salvo necesidad futura.
- **Persistencia local:** `IndexedDB` a través de `idb-keyval` para categorías/palabras y `localStorage` para preferencias ligeras (última categoría, lista de jugadores).

## Front-End y UI
- **Framework UI:** `React` 18 con componentes funcionales y Server Components cuando no exista dependencia del DOM.
- **Estilos:** `Tailwind CSS` con configuración personalizada (tokens de color, tipografía y espaciado). Se combinará con `clsx` para composición condicional.
- **Design System:** creación de librería interna de componentes atómicos siguiendo Atomic Design (Tokens → Foundations → Primitives → Composiciones).
- **Animaciones y microinteracciones:** `Framer Motion` para transiciones suaves (paso de jugador, pantalla “¡A jugar!”) manteniendo performance.
- **Iconografía:** `Lucide Icons`, importando solo íconos usados para minimizar bundle.
- **Accesibilidad:** seguir WCAG 2.1 AA; usar `headlessui` solo cuando se requiera accesibilidad compleja (por ejemplo, diálogos), manteniendo control estilístico propio.

## Diseño y Experiencia
- **Enfoque mobile-first:** prototipos basados en breakpoints `375px`, `768px`, `1024px`. Layout fluido con grid/flex modular.
- **Diferenciador visual:** 
  - Paleta dinámica inspirada en luces teatrales (gradientes suaves y sombras volumétricas).
  - Tipografía display personalizada (Google Fonts; combinar sans-serif limpia con variante monoespaciada para UI secundaria).
  - Uso moderado de glassmorphism y neumorfismo plano para destacar tarjetas de palabras.
- **Modo alto contraste:** toggle que aplica tokens de color validados para accesibilidad.

## Datos y Contenido
- **Estructura de categorías/palabras:** archivos `.json` versionados en el repositorio; se cargan estáticamente y se replican al almacenamiento local para edición.
- **Validación:** `zod` para validar esquemas de categorías y palabras antes de persistir; funciones puras reutilizables en servicios.
- **Aleatoriedad controlada:** `seedrandom` opcional para reproducibilidad en tests; en producción se usa `crypto.getRandomValues`.
- **Internacionalización básica:** preparar estructura `en.json`, `es.json` pero solo habilitar español inicialmente.

## Testing y Calidad
- **Unit tests:** `Vitest` + `Testing Library` para lógica de asignación y hooks.
- **Component tests visuales:** `Storybook` para documentar componentes y ejecutar pruebas de accesibilidad (`@storybook/addon-a11y`).
- **E2E (futuro cercano):** `Playwright` orientado a flujo de asignación de palabra en dispositivos móviles simulados.
- **Linter y formateo:** `ESLint` (config Next.js + reglas personalizadas para pureza) y `Prettier`; `lint-staged` en `husky pre-commit`.

## DevOps y Despliegue
- **Hosting:** Vercel (producción y previews automáticos por rama/pull request).
- **Build:** `next build` con target estático; rutas críticas pre-renderizadas, lógica sensible en componentes cliente.
- **CI:** GitHub Actions ejecutando lint + tests + build previo al deploy.
- **Monitoreo:** Vercel Analytics y `Sentry` (modo browser) para capturar errores de cliente.

## Seguridad y Privacidad
- No se almacenan datos personales sensibles; toda la información es local al dispositivo.
- Sanitización de entradas de texto de usuarios para evitar cross-site scripting al renderizar alias de jugadores.
- Feature flag interno para funciones experimentales, controlado vía variables de entorno en build.

## Roadmap Técnico Futuro
- Evaluar `PWA` (Service Worker + manifest) para modo offline completo.
- Integrar `local-first` conflict-free replicators si se añade modo multi-dispositivo.
- Explorar `Trpc` o `GraphQL` solo si se introducen servicios remotos en versiones posteriores.

---

Estas especificaciones garantizan un stack alineado con Vercel, priorizan un diseño distintivo y respeta principios de composición, tipado estricto y mantenibilidad.*** End Patch

