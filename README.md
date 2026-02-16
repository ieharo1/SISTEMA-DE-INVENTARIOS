# Inventory System by TST SOLUTIONS

Sistema de Inventarios Empresarial Full Stack desarrollado por **TST SOLUTIONS**.

Arquitectura full stack profesional con **Node.js + Express + MongoDB** para backend y **React + Vite + TailwindCSS** para frontend.

## Características principales

- **Autenticación Segura**: JWT (access + refresh), hash de contraseñas con bcrypt y RBAC por rol.
- **Seguridad Avanzada**: Helmet, rate limiting, sanitización NoSQL, protección XSS, HPP y validación de payload.
- **Arquitectura MVC**: capas (`controllers`, `models`, `routes`, `services`, `middlewares`, `utils`).
- **CRUD Completo**: Usuarios, productos, categorías, proveedores y movimientos con stock transaccional.
- **Dashboard**: Métricas de inventario, gráficas y últimos movimientos.
- **Reportes Analíticos**: Reportes de inventario, movimientos, bajo stock, valor por categoría y exportación PDF/Excel.
- **Auditoría Automática**: Registro de acciones y logs con Winston.
- **Sistema de Notificaciones**: Notificaciones en tiempo real para todos los usuarios.
- **Perfil de Usuario**: Foto de perfil, edición de información personal.
- **Diseño Responsivo**: Adaptable a dispositivos móviles y escritorio.
- **Modo Oscuro/Claro**: Tema visual configurable.
- **Buscador Global**: Búsqueda rápida de productos.
- **Base Multi-sucursal**: Preparado para soporte multi-almacén.
- **Docker Compose**: Listo para ambiente productivo.

## Estructura

```
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

- **admin**: Control total del sistema, gestión de usuarios, reportes completos.
- **supervisor**: Gestión de productos, reportes limitados, aprobación de movimientos grandes.
- **empleado**: Registro de movimientos, consulta de productos.

## Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Winston (logs)
- Swagger (documentación)

### Frontend
- React 18 + Vite
- TailwindCSS
- Recharts (gráficos)
- Lucide React (iconos)
- React Router DOM

## Docker

```bash
docker compose up --build
```

## Sistema desarrollado por TST SOLUTIONS

© 2026 Inventory System by TST SOLUTIONS - Todos los derechos reservados.
