# HousingUP · Prototipo

> **Proyecto académico.** Prototipo del plan de negocio de HousingUP, elaborado para la asignatura **Plan de Negocio** de 4.º de ADE en **EDEM Escuela de Empresarios** (Valencia, curso 2026-2027). No es un producto en funcionamiento: todos los estudiantes, pisos y contratos que aparecen son **ficticios**.

**Demo:** https://alekostormo-collab.github.io/housingup-prototipo/

## Qué es HousingUP

HousingUP es una app que forma pisos compartidos de estudiantes con compañeros compatibles. Nuestra frase lo resume: **no listamos habitaciones, juntamos personas**.

1. **Perfil.** El estudiante indica su presupuesto, zona, fecha de entrada, horarios, nivel de limpieza, ambiente que busca, cómo estudia, visitas, si fuma y si tiene mascotas o alergias.
2. **Match.** El algoritmo calcula la compatibilidad con otros estudiantes y propone los mejores grupos de cuatro personas.
3. **Grupo.** Muestra los pisos verificados que encajan con el presupuesto de todo el grupo y envía la solicitud al propietario.
4. **Contrato.** El propietario recibe el grupo ya formado, con un borrador de contrato.

El estudiante no paga nada. El propietario paga **800 € por piso completo** o **150 € por habitación**, y solo si alquila: la mitad que una agencia. El modelo encaja con la Ley 12/2023 por el derecho a la vivienda, que pone los gastos de gestión inmobiliaria a cargo del arrendador (art. 20.2 de la LAU).

## Para qué sirve este prototipo

Sirve para **enseñar en clase cómo funcionaría el servicio** y validar la lógica del plan de negocio:

- **Soy estudiante:** rellenas el perfil y ves tu mejor grupo, dos alternativas, los motivos de la compatibilidad y los pisos que encajan.
- **Soy propietario:** ves cómo llega la solicitud de un grupo verificado, la comisión de HousingUP frente a la de una agencia y una calculadora que muestra cuánto cuesta una habitación vacía (del 6,1% de rentabilidad alquilando el piso entero al 9,3% por habitaciones).

## Cómo funciona el algoritmo

La compatibilidad entre dos estudiantes es una suma ponderada de 0 a 100 (`js/compatibilidad.js`):

| Criterio | Peso |
|---|---|
| Horario (madrugador, flexible, nocturno) | 20 |
| Limpieza y orden (1-5) | 20 |
| Ambiente (tranquilo, social, fiestero) | 20 |
| Forma de estudiar | 15 |
| Visitas | 10 |
| Tabaco | 10 |
| Mascotas | 5 |

Hay incompatibilidades que descartan a una pareja aunque el resto encaje: entrar en fechas distintas, alergia frente a mascota, o fumador frente a alguien que solo quiere pisos sin humo. La puntuación de un grupo es la media de todas sus parejas. Para formar grupos se preseleccionan los 12 candidatos más afines y se prueban todas las combinaciones.

Es una versión simplificada: en el MVP real de 2027 el emparejamiento se haría a mano para validar la propuesta, y en 2028 se automatizaría con datos reales de convivencia.

## Ejecutarlo en local

No tiene dependencias. Solo hace falta Node.js 22 o superior para los tests y cualquier servidor estático:

```bash
npm test          # tests del algoritmo (node --test)
npm start         # sirve la web en http://localhost:8080
```

## Seguridad

Aunque sea un prototipo, lo hemos revisado con la checklist del módulo de ciberseguridad e IA que usamos en clase. Ver [SEGURIDAD.md](SEGURIDAD.md).

## Equipo

Proyecto de seis estudiantes de ADE de EDEM: Jon Saldaña (CEO), Alekos Tormo (CTO, desarrollo del prototipo), David Rodríguez (finanzas), Alejandro Amorós (comercial), Antonio Sesé (recursos humanos) y Guillermo Prats (administración).

## Licencia

[MIT](LICENSE). El logotipo y la marca HousingUP pertenecen al equipo del proyecto.
