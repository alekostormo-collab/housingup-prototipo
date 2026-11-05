# Seguridad

Este prototipo se ha revisado con la *Checklist antes de desplegar* del módulo de ciberseguridad e IA que usamos en clase (material de Marc Rivero, licencia MIT). La decisión de diseño más importante es la más sencilla: **no hay servidor**.

## Superficie de ataque

| | |
|---|---|
| Servidor, API o base de datos | No hay. Es una web estática servida por GitHub Pages (HTTPS) |
| Cuentas, contraseñas o sesiones | No hay |
| Claves, tokens o secretos | Ninguno, ni en el código ni en el historial |
| Datos personales | No se recogen. El perfil y las solicitudes de prueba se guardan solo en el `localStorage` del navegador del usuario y se pueden borrar desde la app |
| Peticiones a terceros | Ninguna: sin analítica, sin CDN, sin fuentes externas |
| Dependencias | Cero (`package.json` sin dependencias) |

## Checklist aplicada

- **Salida de datos (XSS):** ni un solo `innerHTML`. Todo el contenido dinámico se inserta con `textContent` / `append` (función `el()` en `js/app.js`).
- **Entrada de datos:** los campos del formulario se validan contra listas blancas y rangos; el nombre se limpia y se limita a 30 caracteres; lo que se lee de `localStorage` se vuelve a filtrar antes de mostrarlo.
- **Content Security Policy** estricta en `index.html`: `default-src 'none'`, scripts y estilos solo del propio dominio, `connect-src 'none'` (la página no puede enviar datos a ningún sitio) y `form-action 'none'`.
- **Secretos:** `gitleaks` sobre todo el historial en cada *push* (GitHub Actions) y antes de publicar.
- **Escáner de patrones** del curso (`escaner-simple.sh`) sin hallazgos.
- **IA:** el prototipo no usa ningún modelo de IA, así que no hay riesgo de *prompt injection*.

## Qué cambiaría en un producto real

El producto real necesitaría servidor, cuentas, verificación de identidad (KYC), pagos y datos personales, así que habría que aplicar la checklist completa: autorización por usuario en cada consulta, sesiones en cookie `HttpOnly`, contraseñas con `argon2`, RLS en la base de datos, cumplimiento del RGPD y la LOPDGDD, y una auditoría antes de abrir al público.

## Avisos

Si encuentras un problema de seguridad, abre un *issue* en el repositorio.
