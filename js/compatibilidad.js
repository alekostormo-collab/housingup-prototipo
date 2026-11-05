// Algoritmo de compatibilidad de HousingUP (versión de prototipo).
// Funciones puras, sin acceso al DOM ni a la red: se pueden probar con `node --test`.

export const PESOS = Object.freeze({
  horario: 20,
  limpieza: 20,
  ambiente: 20,
  estudio: 15,
  visitas: 10,
  fumar: 10,
  mascotas: 5,
});

const ESCALA = Object.freeze({
  ambiente: ['tranquilo', 'social', 'fiestero'],
  estudio: ['silencio', 'normal', 'musica'],
});

const cerca = (a, b, rango) => 1 - Math.abs(a - b) / rango;

function similitudHorario(a, b) {
  if (a === b) return 1;
  if (a === 'mixto' || b === 'mixto') return 0.5;
  return 0; // madrugador frente a nocturno
}

function similitudEscala(campo, a, b) {
  const lista = ESCALA[campo];
  return cerca(lista.indexOf(a), lista.indexOf(b), lista.length - 1);
}

/** Incompatibilidades que descartan a una pareja aunque el resto encaje. */
export function incompatible(a, b) {
  if (a.entrada !== b.entrada) return 'Entráis en fechas distintas';
  if ((a.mascotas === 'tiene' && b.mascotas === 'alergia') ||
      (b.mascotas === 'tiene' && a.mascotas === 'alergia')) return 'Alergia a las mascotas';
  if (a.fuma !== b.fuma && (a.noFumadores || b.noFumadores)) return 'Uno fuma y el otro solo quiere pisos sin humo';
  return null;
}

/** Compatibilidad entre dos estudiantes, de 0 a 100. */
export function compatibilidad(a, b) {
  if (incompatible(a, b)) return 0;
  const parcial = {
    horario: similitudHorario(a.horario, b.horario),
    limpieza: cerca(a.limpieza, b.limpieza, 4),
    ambiente: similitudEscala('ambiente', a.ambiente, b.ambiente),
    estudio: similitudEscala('estudio', a.estudio, b.estudio),
    visitas: cerca(a.visitas, b.visitas, 4),
    fumar: a.fuma === b.fuma ? 1 : 0.3,
    mascotas: a.mascotas === b.mascotas ? 1 : 0.6,
  };
  let total = 0;
  for (const [campo, peso] of Object.entries(PESOS)) total += peso * parcial[campo];
  return Math.round(total);
}

function combinaciones(lista, k, desde = 0, actual = [], salida = []) {
  if (actual.length === k) { salida.push([...actual]); return salida; }
  for (let i = desde; i < lista.length; i++) {
    actual.push(lista[i]);
    combinaciones(lista, k, i + 1, actual, salida);
    actual.pop();
  }
  return salida;
}

/** Media de compatibilidad de todas las parejas de un grupo. */
export function puntuacionGrupo(miembros) {
  let suma = 0, parejas = 0;
  for (let i = 0; i < miembros.length; i++) {
    for (let j = i + 1; j < miembros.length; j++) {
      const p = compatibilidad(miembros[i], miembros[j]);
      if (p === 0) return 0;
      suma += p; parejas++;
    }
  }
  return parejas ? Math.round(suma / parejas) : 0;
}

/**
 * Forma los mejores grupos de `tamano` personas alrededor de `usuario`.
 * Preselecciona los 12 candidatos más afines y prueba todas las combinaciones.
 */
export function mejoresGrupos(usuario, candidatos, tamano = 4, cuantos = 3) {
  const afines = candidatos
    .filter((c) => c.id !== usuario.id && !incompatible(usuario, c))
    .map((c) => ({ c, p: compatibilidad(usuario, c) }))
    .sort((x, y) => y.p - x.p)
    .slice(0, 12)
    .map((x) => x.c);
  return combinaciones(afines, tamano - 1)
    .map((resto) => {
      const miembros = [usuario, ...resto];
      return { miembros, puntuacion: puntuacionGrupo(miembros) };
    })
    .filter((g) => g.puntuacion > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .slice(0, cuantos);
}

/** Pisos verificados que encajan con el grupo: tamaño, zona y presupuesto de todos. */
export function pisosParaGrupo(miembros, pisos, zona) {
  const presupuesto = Math.min(...miembros.map((m) => m.presupuesto));
  return pisos
    .filter((p) => p.habitaciones === miembros.length)
    .filter((p) => zona === 'cualquiera' || p.zona === zona)
    .filter((p) => p.precioHabitacion <= presupuesto)
    .sort((a, b) => a.precioHabitacion - b.precioHabitacion);
}

/** Frases que explican por qué el grupo encaja. */
export function motivos(miembros) {
  const todos = (f) => miembros.every(f);
  const salida = [];
  if (todos((m) => m.horario === miembros[0].horario)) {
    salida.push(miembros[0].horario === 'madrugador' ? 'Todos sois madrugadores'
      : miembros[0].horario === 'nocturno' ? 'Todos sois de horario nocturno' : 'Todos tenéis horarios flexibles');
  }
  const limp = miembros.map((m) => m.limpieza);
  if (Math.max(...limp) - Math.min(...limp) <= 1) salida.push(`Nivel de limpieza parecido (${Math.min(...limp)}-${Math.max(...limp)} sobre 5)`);
  if (todos((m) => m.ambiente === miembros[0].ambiente)) salida.push(`Buscáis el mismo ambiente: ${miembros[0].ambiente}`);
  if (todos((m) => m.estudio === miembros[0].estudio)) salida.push(`Mismo estilo de estudio: ${miembros[0].estudio === 'musica' ? 'con música' : miembros[0].estudio}`);
  if (todos((m) => !m.fuma)) salida.push('Nadie fuma');
  if (salida.length === 0) salida.push('Hábitos complementarios y sin incompatibilidades');
  return salida;
}

/**
 * Comisión de HousingUP para el propietario. El plan de negocio fija precios cerrados:
 * 800 € por piso completo (la mitad de una mensualidad media de 1.600 €) y 150 € por habitación.
 */
export const PRECIO_PISO = 800;
export const PRECIO_HABITACION = 150;
export function comision(tipo = 'piso') {
  return tipo === 'habitacion' ? PRECIO_HABITACION : PRECIO_PISO;
}

/** Calculadora de rentabilidad bruta para el propietario. */
export function rentabilidad({ precioVivienda, alquilerEntero, precioHabitacion, habitaciones, mesesVacios }) {
  const anualEntero = alquilerEntero * 12;
  const anualHabitaciones = precioHabitacion * habitaciones * 12;
  const perdidaVacio = precioHabitacion * mesesVacios;
  return {
    entero: anualEntero / precioVivienda,
    habitaciones: anualHabitaciones / precioVivienda,
    conVacio: (anualHabitaciones - perdidaVacio) / precioVivienda,
    perdidaVacio,
    anualHabitaciones,
  };
}
