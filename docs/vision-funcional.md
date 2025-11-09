# Visión Funcional de la Aplicación *El Impostor*

## Propósito
- Ofrecer una experiencia web ligera que permita iniciar partidas de *El Impostor* sin procesos de registro.
- Facilitar la administración y selección de palabras/categorías desde la propia app, priorizando el juego presencial.
- Guiar la asignación de palabras de manera secuencial para que cada jugador reciba su rol pasando el mismo dispositivo.

## Principios de Diseño
- **Acceso inmediato:** ingreso a la sala sin autenticación ni creación de perfiles.
- **Datos locales:** palabras y categorías gestionadas desde archivos locales (`.json` u otro formato equivalente).
- **Composición y pureza:** lógica separada en funciones puras, minimizando estado global.
- **Experiencia mínima guiada:** interfaz que acompañe únicamente la configuración inicial y la asignación de palabras, dejando la dinámica de rondas al grupo presencial.

## Actores
- **Organizador:** crea la partida, selecciona categoría y guía la asignación de palabras.
- **Jugador:** recibe su palabra o la etiqueta de impostor de forma privada.
- **Espectador opcional (futuro):** visualiza el progreso sin participar. No se incluye en la iteración actual.

## Contexto de Uso
- Partidas presenciales usando un único dispositivo que se pasa entre jugadores.
- Conectividad estable no crítica; los datos claves residen localmente.
- Se asume un grupo mínimo de 4 jugadores por partida.

## Reglas de Negocio Clave
- Debe existir exactamente un impostor por partida (modo estándar).
- La palabra secreta se reparte a todos excepto al impostor, que recibe la etiqueta `IMPOSTOR`.
- La categoría "Random" selecciona palabras mezcladas de múltiples categorías disponibles.
- La app actual solo automatiza la asignación inicial; rondas, pistas y votaciones se realizan presencialmente sin soporte digital.
- Validar que la cantidad de jugadores sea coherente con el modo estándar (mínimo 4).

## Alcance de la Iteración Actual (Asignación Presencial)
- Configurar partida básica (nombre opcional, categoría o Random, número de impostores = 1).
- Registrar jugadores, verificar duplicados y ordenar turnos.
- Asignar palabra secreta e impostor de forma aleatoria respetando la categoría elegida.
- Mostrar la palabra o el rol a cada jugador de manera secuencial, con confirmación antes de pasar al siguiente.
- Presentar pantalla final "¡A jugar!" tras completar la asignación.
- Ofrecer acción "Siguiente ronda" que reinicia únicamente la asignación manteniendo jugadores y configuraciones.

## Requisitos Funcionales (RF)
- **RF-01 Configurar partida básica:** definir nombre opcional de sala, seleccionar categoría (incluye Random) y confirmar la lista de jugadores.
- **RF-02 Gestionar jugadores:** añadir, editar, eliminar y reordenar nombres antes de iniciar; validar mínimo de 4 jugadores y evitar duplicados.
- **RF-03 Seleccionar palabra:** obtener una palabra aleatoria según la categoría elegida y registrarla temporalmente para la partida.
- **RF-04 Asignar roles:** elegir al impostor de forma aleatoria y asociarlo a uno de los jugadores.
- **RF-05 Mostrar información por jugador:** presentar de manera privada la palabra o la etiqueta `IMPOSTOR`, con controles de siguiente/anterior y confirmación de lectura.
- **RF-06 Finalizar asignación:** mostrar pantalla "¡A jugar!" una vez que todos los jugadores han visto su información.
- **RF-07 Iniciar siguiente ronda:** reutilizar configuración y jugadores existentes, generando nueva palabra y nuevo impostor con un solo comando.
- **RF-08 Administrar categorías locales:** visualizar y editar categorías/palabras almacenadas localmente (mínimo CRUD básico).
- **RF-09 Persistir preferencias básicas:** recordar última categoría usada y estado de la lista de jugadores en almacenamiento local.

### Backlog Funcional (futuro)
- Guiar rondas de pistas, gestionar votaciones y calcular resultados.
- Implementar variaciones como doble impostor o modo rápido.
- Exportar/importar configuraciones y categorías.
- Habilitar modo espectador o sincronización multi-dispositivo.

## Requisitos No Funcionales (RNF)
- **RNF-01 Usabilidad:** interfaz clara con instrucciones para pasar el dispositivo y confirmaciones visibles.
- **RNF-02 Rendimiento:** operaciones instantáneas (sin llamadas remotas); carga inicial < 2s en dispositivos comunes.
- **RNF-03 Disponibilidad:** funcionar offline tras la primera carga, apoyándose en almacenamiento local.
- **RNF-04 Escalabilidad funcional:** permitir incorporar variaciones (p. ej., doble impostor) con cambios mínimos en la lógica central.
- **RNF-05 Accesibilidad:** soporte de navegación por teclado y cumplimiento básico de contraste.
- **RNF-06 Integridad de datos:** validar formatos y duplicados al editar categorías/palabras; manejo de errores con mensajes claros.
- **RNF-07 Calidad de código:** composición y funciones puras, sin dependencias circulares; pruebas unitarias para reglas de asignación.

## Flujo General de Partida (Iteración Actual)
1. Organizador accede a la app y configura partida básica (`RF-01`).
2. Registra jugadores y valida requisitos (`RF-02`).
3. La app selecciona palabra e impostor (`RF-03`, `RF-04`).
4. Cada jugador observa su información pasando el dispositivo (`RF-05`).
5. Se muestra pantalla "¡A jugar!" indicando que continúa el juego presencial (`RF-06`).
6. Al finalizar la ronda presencial, el organizador pulsa "Siguiente ronda" para repetir asignación (`RF-07`).

## Reglas de Validación y Errores
- Evitar duplicados de nombres de jugadores dentro de una misma partida.
- Impedir iniciar la asignación si faltan jugadores mínimos o palabras en la categoría seleccionada.
- Confirmar antes de reiniciar asignaciones o limpiar datos.
- Mensajes de error en lenguaje natural con indicaciones de resolución (p. ej., "Agrega al menos 4 jugadores para comenzar").

## Métricas de Éxito Iniciales
- Tiempo medio de configuración < 1 minuto desde la pantalla inicial hasta "¡A jugar!".
- Al menos 90% de los usuarios comprende cómo pasar el dispositivo usando solo las indicaciones en pantalla.
- Retención de categorías personalizadas tras cerrar y reabrir la app.

## Riesgos y Mitigaciones
- **Confusión en reparto de roles:** agregar modo de ver roles uno a uno con confirmación del jugador.
- **Pérdida de datos locales:** permitir exportaciones manuales periódicas y advertencias antes de borrar.
- **Variaciones futuras:** diseñar modelo de datos flexible que acepte múltiples impostores o reglas adicionales.

## Próximos Pasos
- Refinar historias de usuario enfocadas en la asignación presencial.
- Diseñar flujo de pantallas y estados para la secuencia de visualización.
- Definir estructura de datos local para categorías y jugadores, priorizando pureza y composición.
- Documentar criterios para futuras funciones (votaciones, estadísticas) sin comprometer el diseño actual.

