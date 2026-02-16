# Sistema de Inventarios Empresarial Full Stack

Arquitectura full stack profesional con **Node.js + Express + MongoDB** para backend y **React + Vite + Tailwind** para frontend.

## Características principales
- Autenticación JWT (access + refresh), hash de contraseñas con bcrypt y RBAC por rol.
- Seguridad avanzada: Helmet, rate limiting, sanitización NoSQL, protección XSS, HPP y validación de payload.
- MVC + capas (`controllers`, `models`, `routes`, `services`, `middlewares`, `utils`).
- CRUD de usuarios, productos, categorías, proveedores y movimientos con stock transaccional.
- Dashboard con métricas de inventario, gráficas y últimos movimientos.
- Reportes analíticos y exportación PDF/Excel.
- Auditoría automática de acciones y logs con Winston.
- Base para soporte multi-sucursal/almacén.
- Docker Compose listo para ambiente productivo inicial.

## Estructura

```text
/backend
  /config /controllers /models /routes /middlewares /services /utils /docs
/frontend
  /src/components /src/pages /src/layouts /src/services /src/context /src/hooks
```

## Inicio rápido

1. Copiar variables de entorno:
   - `cp backend/.env.example backend/.env`
2. Instalar dependencias:
   - `npm run install:all`
3. Ejecutar backend:
   - `npm run dev:backend`
4. Ejecutar frontend:
   - `npm run dev:frontend`
5. Swagger:
   - `http://localhost:5000/api/docs`

## Roles
- **admin**: control total del sistema.
- **supervisor**: gestión de productos y reportes limitados.
- **empleado**: operación diaria de movimientos y consulta.

## Docker

```bash
docker compose up --build
```
