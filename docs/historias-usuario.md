# Historias de Usuario y Criterios de Aceptación

## Iteración actual: Asignación presencial

### HU-01 Configurar partida básica

- **Como** organizador
- **Quiero** iniciar una partida indicando categoría y lista de jugadores
- **Para** comenzar rápidamente sin configuraciones complejas
- **Criterios de aceptación**
  - Permite establecer nombre de sala opcional y seleccionar categoría (incluyendo Random).
  - Valida que existan palabras disponibles en la categoría elegida.
  - Guarda temporalmente la configuración para reutilizarla en la siguiente ronda.

### HU-02 Gestionar jugadores locales

- **Como** organizador
- **Quiero** añadir, editar, eliminar y ordenar jugadores antes de iniciar
- **Para** asegurar que cada participante quede registrado con su nombre
- **Criterios de aceptación**
  - Exige mínimo 4 jugadores únicos; muestra error claro si no se cumple.
  - Permite reordenar jugadores para definir el orden de visualización.
  - Mantiene la lista entre rondas mientras no se restablezca manualmente.

### HU-03 Asignar palabra e impostor

- **Como** sistema
- **Quiero** seleccionar aleatoriamente la palabra secreta y al impostor
- **Para** garantizar imparcialidad en cada partida
- **Criterios de aceptación**
  - Selecciona palabra según categoría elegida (Random mezcla categorías activas).
  - Asigna exactamente un impostor al azar entre los jugadores registrados.
  - Registra internamente la palabra y el impostor solo durante la partida activa.

### HU-04 Mostrar información privada jugador a jugador

- **Como** jugador
- **Quiero** ver mi palabra o saber que soy impostor en privado
- **Para** participar sin revelar información al resto
- **Criterios de aceptación**
  - Presenta la palabra o la etiqueta `IMPOSTOR` en pantalla completa.
  - Incluye controles “Siguiente” y “Mostrar de nuevo” según corresponda.
  - Solicita confirmación antes de pasar el dispositivo al siguiente jugador.

### HU-05 Pantalla "¡A jugar!" y siguiente ronda

- **Como** organizador
- **Quiero** cerrar la asignación y poder iniciar una nueva ronda cuando termine el juego presencial
- **Para** reutilizar la configuración sin repetir todos los pasos
- **Criterios de aceptación**
  - Muestra mensaje “¡A jugar!” cuando todos vieron su información.
  - Ofrece acción “Siguiente ronda” que repite selección de palabra e impostor con la misma lista de jugadores.
  - Permite volver a pantalla de configuración para modificar datos cuando se requiera.

### HU-06 Persistir preferencias básicas

- **Como** organizador recurrente
- **Quiero** conservar la última categoría y lista de jugadores
- **Para** reducir tiempo de preparación en la siguiente sesión
- **Criterios de aceptación**
  - Guarda en almacenamiento local la lista de jugadores y categoría seleccionada.
  - Permite limpiar manualmente estos datos desde la interfaz.
  - Restaura la información al cargar la aplicación nuevamente.

## Backlog futuro

### HU-B01 Guiar rondas de pistas

- **Como** organizador
- **Quiero** avanzar ronda por ronda con control de turnos
- **Para** mantener el ritmo del juego y evitar confusiones
- **Notas:** incluir temporizadores, registro de pistas y control de participación.

### HU-B02 Gestionar votaciones y resultados

- **Como** jugador
- **Quiero** votar quién es el impostor y ver resultados
- **Para** cerrar la partida en la aplicación
- **Notas:** recopilar votos, resolver empates, calcular ganador y mostrar resumen.

### HU-B03 Variaciones y analytics

- **Como** equipo de producto
- **Quiero** habilitar modos avanzados (doble impostor, modo rápido) y métricas
- **Para** ampliar rejugabilidad y medir el uso
- **Notas:** definir reglas adicionales, dependencias de datos y métricas clave.
