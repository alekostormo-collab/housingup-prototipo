import { ESTUDIANTES, PISOS, ZONAS } from './datos.js';
import { mejoresGrupos, pisosParaGrupo, motivos, comision, rentabilidad, compatibilidad } from './compatibilidad.js';

// ---------- utilidades (sin innerHTML: todo el texto va por textContent) ----------
function el(tag, attrs = {}, ...hijos) {
  const nodo = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') nodo.className = v;
    else if (k === 'text') nodo.textContent = v;
    else if (k.startsWith('on')) nodo.addEventListener(k.slice(2), v);
    else nodo.setAttribute(k, v);
  }
  for (const h of hijos) if (h != null) nodo.append(h instanceof Node ? h : String(h));
  return nodo;
}
const euros = (n) => `${Math.round(n).toLocaleString('es-ES', { useGrouping: 'always' })} €`;
const pct = (n) => `${(n * 100).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const limpiar = (s) => String(s ?? '').replace(/[^\p{L}\p{N} .'-]/gu, '').trim().slice(0, 30);

const almacen = {
  leer(clave, defecto) {
    try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; } catch { return defecto; }
  },
  guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* modo privado: no pasa nada */ }
  },
};

// ---------- navegación ----------
function mostrar(vista) {
  const valida = ['inicio', 'estudiante', 'propietario', 'proyecto'].includes(vista) ? vista : 'inicio';
  document.querySelectorAll('.vista').forEach((s) => { s.hidden = s.dataset.vista !== valida; });
  document.querySelectorAll('.menu a').forEach((a) => a.classList.toggle('activo', a.dataset.vista === valida));
  if (valida === 'propietario') pintarSolicitudes();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => mostrar(location.hash.slice(1)));

// ---------- perfil del estudiante ----------
const form = document.getElementById('perfil');
const selZona = document.getElementById('zona');
for (const [valor, nombre] of Object.entries(ZONAS)) selZona.append(el('option', { value: valor, text: nombre }));
selZona.value = 'tarongers';

for (const campo of ['presupuesto', 'limpieza', 'visitas']) {
  const input = form.elements[campo];
  const salida = document.getElementById(`${campo}-valor`);
  const actualizar = () => { salida.textContent = campo === 'presupuesto' ? euros(input.value) : input.value; };
  input.addEventListener('input', actualizar); actualizar();
}

function leerPerfil() {
  const f = form.elements;
  const num = (v, min, max) => Math.min(max, Math.max(min, Number(v) || min));
  return {
    id: 'yo',
    nombre: limpiar(f.nombre.value) || 'Tú',
    estudios: 'Tu perfil', origen: '—',
    presupuesto: num(f.presupuesto.value, 300, 550),
    zona: Object.hasOwn(ZONAS, f.zona.value) ? f.zona.value : 'cualquiera',
    entrada: f.entrada.value === 'enero' ? 'enero' : 'septiembre',
    horario: ['madrugador', 'mixto', 'nocturno'].includes(f.horario.value) ? f.horario.value : 'mixto',
    limpieza: num(f.limpieza.value, 1, 5),
    ambiente: ['tranquilo', 'social', 'fiestero'].includes(f.ambiente.value) ? f.ambiente.value : 'social',
    estudio: ['silencio', 'normal', 'musica'].includes(f.estudio.value) ? f.estudio.value : 'normal',
    visitas: num(f.visitas.value, 1, 5),
    fuma: f.fuma.checked,
    noFumadores: f.noFumadores.checked,
    mascotas: ['no', 'tiene', 'alergia'].includes(f.mascotas.value) ? f.mascotas.value : 'no',
  };
}

function tarjetaMiembro(m, yo) {
  const iniciales = m.nombre.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  return el('li', { class: 'miembro' },
    el('span', { class: 'avatar', text: iniciales }),
    el('span', {}, el('strong', { text: m.nombre }), el('small', { text: m.id === 'yo' ? 'Tú' : `${m.estudios} · ${m.origen}` })),
    m.id === 'yo' ? null : el('span', { class: 'afinidad', text: `${compatibilidad(yo, m)}%`, title: 'Compatibilidad contigo' }));
}

function tarjetaPiso(piso, grupo, puntuacion) {
  const total = piso.precioHabitacion * piso.habitaciones;
  return el('article', { class: 'piso' },
    el('p', { class: 'sello', text: 'Piso verificado' }),
    el('h4', { text: piso.titulo }),
    el('p', { class: 'meta', text: `${ZONAS[piso.zona]} · ${piso.metros} m² · ${piso.minutosCampus} min al campus` }),
    el('p', { class: 'precio' }, el('strong', { text: `${euros(piso.precioHabitacion)}/mes` }), ` por habitación · ${euros(total)}/mes el piso`),
    el('p', { class: 'meta', text: piso.extras.join(' · ') }),
    el('button', { class: 'boton boton-negro', type: 'button', onclick: () => enviarSolicitud(piso, grupo, puntuacion) }, 'Enviar solicitud al propietario'));
}

function pintarResultados(yo) {
  const caja = document.getElementById('resultados');
  caja.replaceChildren();
  const grupos = mejoresGrupos(yo, ESTUDIANTES);
  if (grupos.length === 0) {
    caja.append(el('p', { class: 'vacio', text: 'Con estos criterios todavía no hay un grupo compatible. Prueba con otra fecha de entrada o con menos restricciones.' }));
    return;
  }
  grupos.forEach((g, i) => {
    const pisos = pisosParaGrupo(g.miembros, PISOS, yo.zona);
    const bloque = el('section', { class: i === 0 ? 'grupo destacado' : 'grupo' },
      el('header', {},
        el('p', { class: 'etiqueta', text: i === 0 ? 'Tu mejor grupo' : `Alternativa ${i}` }),
        el('p', { class: 'nota-grande', text: `${g.puntuacion}% de compatibilidad` })),
      el('ul', { class: 'miembros' }, ...g.miembros.map((m) => tarjetaMiembro(m, yo))),
      el('ul', { class: 'motivos' }, ...motivos(g.miembros).map((t) => el('li', { text: t }))));
    if (pisos.length) bloque.append(el('div', { class: 'pisos' }, ...pisos.slice(0, 2).map((p) => tarjetaPiso(p, g.miembros, g.puntuacion))));
    else bloque.append(el('p', { class: 'vacio', text: 'No hay pisos verificados de 4 habitaciones dentro del presupuesto de todo el grupo en esta zona. Prueba con «Cualquier zona».' }));
    caja.append(bloque);
  });
  caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', (ev) => { ev.preventDefault(); pintarResultados(leerPerfil()); });

// ---------- solicitudes al propietario ----------
function enviarSolicitud(piso, miembros, puntuacion) {
  const lista = almacen.leer('housingup-solicitudes', []);
  lista.unshift({
    id: Date.now(),
    piso: piso.id,
    puntuacion,
    miembros: miembros.map((m) => ({ nombre: m.nombre, estudios: m.estudios, origen: m.origen })),
    fecha: new Date().toISOString(),
  });
  almacen.guardar('housingup-solicitudes', lista.slice(0, 10));
  const aviso = el('div', { class: 'confirmacion' },
    el('strong', { text: 'Solicitud enviada.' }),
    ' El propietario recibe el grupo verificado y el borrador del contrato. ',
    el('a', { href: '#propietario', text: 'Ver cómo lo recibe →' }));
  document.getElementById('resultados').prepend(aviso);
  aviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function pintarSolicitudes() {
  const caja = document.getElementById('solicitudes');
  caja.replaceChildren();
  const lista = almacen.leer('housingup-solicitudes', []).filter((s) => PISOS.some((p) => p.id === s.piso));
  if (!lista.length) {
    caja.append(el('p', { class: 'vacio' }, 'Aún no hay solicitudes. ', el('a', { href: '#estudiante', text: 'Forma un grupo como estudiante' }), ' y envíala para verla aquí.'));
    return;
  }
  for (const s of lista) {
    const piso = PISOS.find((p) => p.id === s.piso);
    const fee = comision('piso');
    const mensualidad = piso.precioHabitacion * piso.habitaciones;
    const contrato = el('details', { class: 'contrato' },
      el('summary', { text: 'Ver borrador del contrato (ilustrativo)' }),
      el('p', { text: `Contrato de arrendamiento de habitaciones (Ley 29/1994, de Arrendamientos Urbanos) · ${piso.titulo}.` }),
      el('p', { text: `Arrendatarios: ${s.miembros.map((m) => limpiar(m.nombre)).join(', ')}. Duración: curso académico. Renta: ${euros(piso.precioHabitacion)} al mes por habitación.` }),
      el('p', { text: 'Los gastos de gestión inmobiliaria corren a cargo del arrendador (art. 20.2 LAU). Borrador de ejemplo sin validez legal.' }));
    caja.append(el('article', { class: 'solicitud' },
      el('header', {},
        el('p', { class: 'etiqueta', text: `Nueva solicitud · ${new Date(s.fecha).toLocaleDateString('es-ES')}` }),
        el('h3', { text: piso.titulo })),
      el('p', {}, el('strong', { text: `${s.miembros.length} estudiantes verificados` }), ` · ${Number(s.puntuacion) || 0}% de compatibilidad entre ellos`),
      el('ul', { class: 'miembros compactos' }, ...s.miembros.map((m) => el('li', { text: `${limpiar(m.nombre)} — ${limpiar(m.estudios)}` }))),
      el('div', { class: 'cifras' },
        el('div', { class: 'tarjeta crema' }, el('p', { class: 'etiqueta', text: 'Ingresos del curso' }), el('p', { class: 'cifra', text: euros(piso.precioHabitacion * piso.habitaciones * 10) }), el('p', { text: '10 meses, piso completo' })),
        el('div', { class: 'tarjeta roja' }, el('p', { class: 'etiqueta', text: 'Comisión HousingUP' }), el('p', { class: 'cifra', text: euros(fee) }), el('p', { text: 'Precio cerrado por piso, solo si alquilas' })),
        el('div', { class: 'tarjeta oscura' }, el('p', { class: 'etiqueta', text: 'Una agencia cobraría' }), el('p', { class: 'cifra', text: euros(mensualidad) }), el('p', { text: 'Una mensualidad completa' }))),
      contrato));
  }
  caja.append(el('button', { class: 'boton boton-borde', type: 'button', onclick: () => { almacen.guardar('housingup-solicitudes', []); pintarSolicitudes(); } }, 'Borrar solicitudes de prueba'));
}

// ---------- calculadora del propietario ----------
const calc = document.getElementById('calculadora');
function pintarRentabilidad() {
  const v = Object.fromEntries([...new FormData(calc)].map(([k, x]) => [k, Math.max(0, Number(x) || 0)]));
  if (!v.precioVivienda) return;
  const r = rentabilidad(v);
  document.getElementById('rentabilidad').replaceChildren(
    el('div', { class: 'tarjeta crema' }, el('p', { class: 'etiqueta', text: 'Alquilando el piso entero' }), el('p', { class: 'cifra', text: pct(r.entero) }), el('p', { text: 'Rentabilidad bruta anual' })),
    el('div', { class: 'tarjeta oscura' }, el('p', { class: 'etiqueta', text: 'Por habitaciones, lleno' }), el('p', { class: 'cifra', text: pct(r.habitaciones) }), el('p', { text: `${euros(r.anualHabitaciones)} al año` })),
    el('div', { class: 'tarjeta roja' }, el('p', { class: 'etiqueta', text: 'Con una habitación vacía' }), el('p', { class: 'cifra', text: pct(r.conVacio) }), el('p', { text: `Pierdes ${euros(r.perdidaVacio)} al año` })));
}
calc.addEventListener('input', pintarRentabilidad);
pintarRentabilidad();

mostrar(location.hash.slice(1));
