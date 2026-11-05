import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compatibilidad, incompatible, mejoresGrupos, pisosParaGrupo, puntuacionGrupo, comision, rentabilidad } from '../js/compatibilidad.js';
import { ESTUDIANTES, PISOS } from '../js/datos.js';

const base = { id: 'a', entrada: 'septiembre', horario: 'madrugador', limpieza: 4, ambiente: 'tranquilo', estudio: 'silencio', visitas: 2, fuma: false, noFumadores: false, mascotas: 'no', presupuesto: 420 };

test('dos perfiles idénticos son 100% compatibles', () => {
  assert.equal(compatibilidad(base, { ...base, id: 'b' }), 100);
});

test('la compatibilidad es simétrica y está entre 0 y 100', () => {
  for (const a of ESTUDIANTES) for (const b of ESTUDIANTES) {
    const p = compatibilidad(a, b);
    assert.equal(p, compatibilidad(b, a));
    assert.ok(p >= 0 && p <= 100);
  }
});

test('alergia frente a mascota descarta la pareja', () => {
  const b = { ...base, id: 'b', mascotas: 'tiene' };
  assert.ok(incompatible({ ...base, mascotas: 'alergia' }, b));
  assert.equal(compatibilidad({ ...base, mascotas: 'alergia' }, b), 0);
});

test('fechas de entrada distintas descartan la pareja', () => {
  assert.equal(compatibilidad(base, { ...base, id: 'b', entrada: 'enero' }), 0);
});

test('los grupos tienen 4 personas, incluyen al usuario y van ordenados', () => {
  const grupos = mejoresGrupos(base, ESTUDIANTES);
  assert.ok(grupos.length > 0);
  for (const g of grupos) {
    assert.equal(g.miembros.length, 4);
    assert.equal(g.miembros[0].id, 'a');
    assert.equal(g.puntuacion, puntuacionGrupo(g.miembros));
  }
  for (let i = 1; i < grupos.length; i++) assert.ok(grupos[i - 1].puntuacion >= grupos[i].puntuacion);
});

test('los pisos respetan el presupuesto de todo el grupo y el tamaño', () => {
  const grupo = mejoresGrupos(base, ESTUDIANTES)[0].miembros;
  const tope = Math.min(...grupo.map((m) => m.presupuesto));
  for (const p of pisosParaGrupo(grupo, PISOS, 'cualquiera')) {
    assert.equal(p.habitaciones, 4);
    assert.ok(p.precioHabitacion <= tope);
  }
});

test('la comisión es la del plan: 800 € por piso y 150 € por habitación', () => {
  assert.equal(comision('piso'), 800);
  assert.equal(comision('habitacion'), 150);
});

test('la calculadora reproduce el 6,1% y el 9,3% del plan de negocio', () => {
  const r = rentabilidad({ precioVivienda: 145000, alquilerEntero: 740, precioHabitacion: 280, habitaciones: 4, mesesVacios: 8 });
  assert.equal(Math.round(r.entero * 1000) / 10, 6.1);
  assert.equal(Math.round(r.habitaciones * 1000) / 10, 9.3);
  assert.equal(r.perdidaVacio, 2240);
});
