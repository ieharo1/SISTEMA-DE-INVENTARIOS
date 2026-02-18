# 🟢 TST SOLUTIONS - Inventory System

**Inventory System** es un sistema de inventarios empresarial Full Stack desarrollado por **TST Solutions** ("Te Solucionamos Todo").

---

## 📦 ¿Qué es Inventory System?

**Inventory System** es un sistema de inventarios empresarial Full Stack con arquitectura profesional. Moderno, escalable y listo para producción.

> *"Tecnología que funciona. Soluciones que escalan."*

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- JWT (access + refresh tokens)
- Hash de contraseñas con bcrypt
- RBAC por rol (admin, supervisor, empleado)
- Helmet, rate limiting, sanitización
- Protección XSS y HPP

### 📊 Gestión de Inventario
- CRUD completo de usuarios, productos, categorías
- Proveedores y movimientos con stock transaccional
- Sistema de notificaciones en tiempo real
- Buscador global de productos
- Base multi-sucursal (multi-almacén)

### 📈 Dashboard y Reportes
- Métricas de inventario en tiempo real
- Gráficos y visualización de datos
- Últimos movimientos
- Reportes de inventario
- Bajo stock, valor por categoría
- Exportación PDF/Excel

### 🛡️ Auditoría
- Registro de acciones automático
- Logs con Winston
- Historial completo de operaciones

### 🎨 Frontend
- Diseño responsivo (móvil y escritorio)
- Modo oscuro/claro
- Perfil de usuario con foto
- Interfaz moderna e intuitiva

---

## 🏗️ Estructura Técnica del Proyecto

```
INVENTORY-SYSTEM/
├── backend/
│   ├── config/          # Configuración
│   ├── controllers/    # Controladores
│   ├── models/         # Modelos Mongoose
│   ├── routes/         # Rutas API
│   ├── middlewares/    # Middlewares
│   ├── services/       # Servicios
│   ├── utils/          # Utilidades
│   └── docs/           # Documentación Swagger
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas
│   │   ├── layouts/    # Layouts
│   │   ├── services/  # Servicios API
│   │   ├── context/    # Contextos
│   │   └── hooks/      # Hooks personalizados
│   └── package.json
│
└── docker-compose.yml
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** + bcrypt
- **Winston** (logs)
- **Swagger** (documentación API)

### Frontend
- **React 18** + Vite
- **TailwindCSS**
- **Recharts** (gráficos)
- **Lucide React** (iconos)
- **React Router DOM**

---

## 👥 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Admin** | Control total del sistema, gestión de usuarios, reportes completos |
| **Supervisor** | Gestión de productos, reportes limitados, aprobación de movimientos grandes |
| **Empleado** | Registro de movimientos, consulta de productos |

---

## 🎨 Identidad Visual

### Paleta de Colores
- **Primary:** #1E3A5F (Azul profundo)
- **Secondary:** #00BFA5 (Verde azulado)
- **Success:** #10B981 (Verde)
- **Warning:** #F59E0B (Amarillo)
- **Danger:** #EF4444 (Rojo)

### Tipografía
- **Títulos:** System Default (Bold)
- **Contenido:** System Default (Regular)

---

## 🏆 Características Técnicas

✅ Diseño 100% responsive  
✅ Arquitectura MVC profesional  
✅ Seguridad avanzada  
✅ Dashboard en tiempo real  
✅ Reportes PDF/Excel  
✅ Auditoría completa  
✅ Notificaciones en tiempo real  
✅ Docker Compose listo  

---

## 🚀 Inicio Rápido

```bash
# 1. Copiar variables de entorno
cp backend/.env.example backend/.env

# 2. Instalar dependencias
npm run install:all

# 3. Ejecutar backend
npm run dev:backend

# 4. Ejecutar frontend
npm run dev:frontend

# 5. Ver documentación API
# http://localhost:5000/api/docs
```

### Docker

```bash
docker compose up --build
```

---

## 🌎 Información de Contacto - TST Solutions

📍 **Quito - Ecuador**

📱 **WhatsApp:** +593 99 796 2747  
💬 **Telegram:** @TST_Ecuador  
📧 **Email:** negocios@tstsolutions.com.ec

🌐 **Web:** https://tst-solutions.netlify.app/  
📘 **Facebook:** https://www.facebook.com/tstsolutionsecuador/  
🐦 **Twitter/X:** https://x.com/SolutionsT95698

---

## 📄 Licencia

© 2026 Inventory System by TST SOLUTIONS - Todos los derechos reservados.

---

## 👨‍💻 Desarrollado por TST SOLUTIONS

*Technology that works. Solutions that scale.*

---

<div align="center">
  <p><strong>TST Solutions</strong> - Te Solucionamos Todo</p>
</div>
