// Datos 100% FICTICIOS para la demostración. Ninguna persona ni piso es real.

export const ZONAS = Object.freeze({
  cualquiera: 'Cualquier zona',
  blasco: 'Blasco Ibáñez (UV)',
  tarongers: 'Tarongers (UV · UPV)',
  vera: 'Camino de Vera (UPV)',
  benimaclet: 'Benimaclet',
  ruzafa: 'Ruzafa',
  centro: 'Centro histórico',
});

const e = (id, nombre, estudios, origen, presupuesto, zona, entrada, horario, limpieza, ambiente, estudio, visitas, fuma, mascotas, noFumadores = false) =>
  Object.freeze({ id, nombre, estudios, origen, presupuesto, zona, entrada, horario, limpieza, ambiente, estudio, visitas, fuma, mascotas, noFumadores });

export const ESTUDIANTES = Object.freeze([
  e('e01', 'Lucía M.', 'Medicina', 'Albacete', 450, 'blasco', 'septiembre', 'madrugador', 5, 'tranquilo', 'silencio', 2, false, 'no', true),
  e('e02', 'Pablo R.', 'Ingeniería Informática', 'Teruel', 420, 'vera', 'septiembre', 'nocturno', 3, 'social', 'musica', 3, false, 'no'),
  e('e03', 'Marta S.', 'ADE', 'Cuenca', 400, 'tarongers', 'septiembre', 'madrugador', 4, 'social', 'normal', 3, false, 'no'),
  e('e04', 'Jonas K.', 'Erasmus · Economía', 'Hamburgo', 480, 'cualquiera', 'septiembre', 'mixto', 4, 'social', 'normal', 4, false, 'no'),
  e('e05', 'Irene L.', 'Enfermería', 'Murcia', 390, 'blasco', 'septiembre', 'madrugador', 5, 'tranquilo', 'silencio', 1, false, 'alergia', true),
  e('e06', 'Diego F.', 'Arquitectura', 'Castellón', 430, 'vera', 'septiembre', 'nocturno', 2, 'fiestero', 'musica', 5, true, 'no'),
  e('e07', 'Clara P.', 'Derecho', 'Soria', 410, 'tarongers', 'septiembre', 'madrugador', 4, 'tranquilo', 'silencio', 2, false, 'no', true),
  e('e08', 'Hugo B.', 'Telecomunicaciones', 'Cuenca', 400, 'vera', 'septiembre', 'mixto', 3, 'social', 'normal', 3, false, 'tiene'),
  e('e09', 'Giulia R.', 'Erasmus · Bellas Artes', 'Bolonia', 460, 'benimaclet', 'septiembre', 'nocturno', 3, 'social', 'musica', 4, true, 'no'),
  e('e10', 'Andrea V.', 'Psicología', 'Alicante', 380, 'blasco', 'septiembre', 'madrugador', 4, 'tranquilo', 'normal', 2, false, 'no'),
  e('e11', 'Sergio T.', 'ADE', 'Logroño', 440, 'tarongers', 'septiembre', 'mixto', 4, 'social', 'normal', 3, false, 'no'),
  e('e12', 'Nora H.', 'Erasmus · Psicología', 'Utrecht', 470, 'cualquiera', 'septiembre', 'madrugador', 5, 'tranquilo', 'silencio', 2, false, 'no'),
  e('e13', 'Álvaro C.', 'Ingeniería Industrial', 'Huesca', 420, 'vera', 'septiembre', 'madrugador', 4, 'social', 'normal', 2, false, 'no'),
  e('e14', 'Paula G.', 'Magisterio', 'Requena', 360, 'tarongers', 'septiembre', 'madrugador', 4, 'tranquilo', 'normal', 2, false, 'no'),
  e('e15', 'Tomás E.', 'Biología', 'Guadalajara', 400, 'benimaclet', 'septiembre', 'mixto', 3, 'social', 'normal', 3, false, 'tiene'),
  e('e16', 'Laura N.', 'Farmacia', 'Ciudad Real', 450, 'blasco', 'septiembre', 'madrugador', 5, 'tranquilo', 'silencio', 1, false, 'no', true),
  e('e17', 'Marc O.', 'Erasmus · Ingeniería', 'Lyon', 490, 'vera', 'septiembre', 'nocturno', 3, 'fiestero', 'musica', 4, false, 'no'),
  e('e18', 'Elena D.', 'Periodismo', 'Zamora', 390, 'benimaclet', 'septiembre', 'mixto', 3, 'social', 'normal', 4, false, 'no'),
  e('e19', 'Rubén A.', 'Fisioterapia', 'Elche', 410, 'blasco', 'septiembre', 'madrugador', 4, 'social', 'normal', 3, false, 'no'),
  e('e20', 'Sara Q.', 'Química', 'Ávila', 420, 'tarongers', 'septiembre', 'madrugador', 5, 'tranquilo', 'silencio', 2, false, 'no'),
  e('e21', 'Emma W.', 'Erasmus · Turismo', 'Dublín', 450, 'ruzafa', 'enero', 'nocturno', 3, 'fiestero', 'musica', 5, false, 'no'),
  e('e22', 'Lukas S.', 'Erasmus · ADE', 'Viena', 460, 'ruzafa', 'enero', 'mixto', 4, 'social', 'normal', 4, false, 'no'),
  e('e23', 'Chloé B.', 'Erasmus · Diseño', 'Burdeos', 440, 'centro', 'enero', 'nocturno', 3, 'social', 'musica', 4, false, 'no'),
  e('e24', 'Mateo J.', 'Erasmus · Historia', 'Lisboa', 430, 'centro', 'enero', 'mixto', 4, 'social', 'normal', 3, false, 'no'),
  e('e25', 'Inés Y.', 'Erasmus · Medicina', 'Oporto', 450, 'cualquiera', 'enero', 'madrugador', 5, 'tranquilo', 'silencio', 2, false, 'no'),
]);

const p = (id, titulo, zona, habitaciones, precioHabitacion, metros, minutosCampus, extras) =>
  Object.freeze({ id, titulo, zona, habitaciones, precioHabitacion, metros, minutosCampus, extras, verificado: true });

export const PISOS = Object.freeze([
  p('p01', 'Piso luminoso junto a Blasco Ibáñez', 'blasco', 4, 400, 95, 5, ['Ascensor', 'Aire acondicionado', 'Wifi 600 Mb']),
  p('p02', 'Piso reformado en Tarongers', 'tarongers', 4, 380, 90, 7, ['Terraza', 'Lavavajillas', 'Wifi']),
  p('p03', 'Cuatro habitaciones cerca de la UPV', 'vera', 4, 410, 100, 4, ['Ascensor', 'Dos baños', 'Wifi']),
  p('p04', 'Piso con patio en Benimaclet', 'benimaclet', 4, 360, 88, 10, ['Patio', 'Bicicletero', 'Wifi']),
  p('p05', 'Ático en Ruzafa', 'ruzafa', 4, 440, 92, 20, ['Terraza', 'Aire acondicionado', 'Wifi']),
  p('p06', 'Piso clásico en el centro', 'centro', 4, 420, 105, 18, ['Techos altos', 'Dos baños', 'Wifi']),
  p('p07', 'Piso económico en Tarongers', 'tarongers', 4, 350, 80, 9, ['Wifi', 'Calefacción']),
  p('p08', 'Piso de tres habitaciones en Blasco', 'blasco', 3, 420, 75, 6, ['Ascensor', 'Wifi']),
]);
