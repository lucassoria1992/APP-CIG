# 🏦 Sistema CIG - Cobranza Integrada Galicia

## ✅ PROYECTO COMPLETO Y FUNCIONAL

¡Tu sistema de gestión de archivos CIG ha sido creado exitosamente! 🎉

---

## 📁 ¿QUÉ SE HA CREADO?

Un sistema completo con:
- ✅ **Backend** (Node.js + Express + MongoDB)
- ✅ **Frontend** (React 18 + Dark Mode)
- ✅ **Autenticación** con JWT y roles
- ✅ **Generador de archivos CIG** (.TXT con 300 caracteres)
- ✅ **Auditoría completa** de acciones
- ✅ **Autocompletado** de clientes
- ✅ **Docker** y PM2 listos para producción
- ✅ **Documentación completa**

---

## 🚀 PRIMEROS PASOS

### 1️⃣ Instalar Dependencias

Abrir PowerShell o CMD en esta carpeta y ejecutar:

**Windows:**
```bash
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### 2️⃣ Verificar que MongoDB está corriendo

```bash
# Windows: Abrir MongoDB como servicio o ejecutar
mongod

# Linux/Mac:
sudo systemctl start mongod
```

### 3️⃣ Crear Usuarios Iniciales

```bash
cd backend
node src/seed.js
```

Esto creará:
- **admin** / admin123 (Administrador)
- **operador01** / operador123 (Operador)
- **auditor01** / auditor123 (Auditor)

### 4️⃣ Iniciar el Sistema

**Opción A - Script Automático (Windows):**
```bash
start.bat
```

**Opción B - Manual:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 5️⃣ Abrir en el Navegador

```
http://localhost:3000
```

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📖 DOCUMENTACIÓN DISPONIBLE

| Archivo | Descripción |
|---------|-------------|
| **PROJECT_SUMMARY.md** | 📝 Resumen ejecutivo del proyecto |
| **QUICK_START.md** | 🚀 Guía de inicio rápido |
| **API_DOCUMENTATION.md** | 📡 Documentación completa de la API |
| **CIG_FORMAT_SPECIFICATION.md** | 📄 Especificación del formato CIG |
| **DEVELOPMENT_GUIDE.md** | 👨‍💻 Guía para desarrolladores |
| **PRODUCTION_DEPLOYMENT.md** | 🌐 Despliegue en producción |
| **README.md** | 📚 Documentación principal |

---

## 💡 CÓMO USAR EL SISTEMA

### Paso 1: Iniciar Sesión
- Abrir `http://localhost:3000`
- Ingresar usuario y contraseña
- Click en "Iniciar Sesión"

### Paso 2: Cargar Cheques
1. Click en "Cargar Cheques"
2. Completar el formulario:
   - **Cliente**: Nombre del cliente
   - **CUIT**: 11 dígitos (ej: 30715225553)
   - **Importe**: Monto del cheque
   - **Fecha de Vencimiento**
   - **Identificación**: Número de documento
3. Click en "Agregar Cheque"
4. Repetir para más cheques

### Paso 3: Generar Archivo CIG
1. Verificar los cheques en la tabla
2. Click en "Generar Archivo TXT"
3. El sistema genera el archivo con formato de 300 caracteres
4. Se crea un nuevo lote automáticamente

### Paso 4: Descargar Archivo
1. Ir a "Archivos Generados"
2. Click en "Descargar" junto al archivo deseado
3. El archivo .TXT se descarga a tu computadora

---

## 🎯 ESTRUCTURA DEL PROYECTO

```
APP CIG/
├── backend/              # Servidor Node.js
│   ├── src/
│   │   ├── models/      # Modelos de datos
│   │   ├── routes/      # Endpoints API
│   │   ├── middleware/  # Autenticación y auditoría
│   │   └── utils/       # Generador de archivos CIG
│   └── .env             # Configuración
│
├── frontend/            # Aplicación React
│   └── src/
│       ├── pages/       # Páginas principales
│       ├── components/  # Componentes reutilizables
│       └── services/    # Cliente API
│
└── data/
    └── exports/cig/     # Archivos CIG generados
```

---

## ⚙️ CONFIGURACIÓN

### Cambiar Puerto del Backend
Editar `backend/.env`:
```
PORT=4000  # Cambiar a otro puerto si es necesario
```

### Cambiar Base de Datos
Editar `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/SntCont
```

### Cambiar Secreto JWT
Editar `backend/.env`:
```
JWT_SECRET=tu_clave_super_secreta_aqui
```

---

## 🔐 ROLES Y PERMISOS

| Funcionalidad | Admin | Operador | Auditor |
|---------------|-------|----------|---------|
| Cargar cheques | ✅ | ✅ | ❌ |
| Generar archivos | ✅ | ✅ | ❌ |
| Ver archivos | ✅ | ✅ | ✅ |
| Descargar archivos | ✅ | ✅ | ✅ |
| Ver auditoría | ✅ | ❌ | ✅ |
| Gestionar usuarios | ✅ | ❌ | ❌ |

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: MongoDB no conecta

**Solución:**
```bash
# Verificar que MongoDB está corriendo
mongod

# O iniciar como servicio (Windows)
net start MongoDB
```

### ❌ Error: Puerto 4000 en uso

**Solución:**
1. Editar `backend/.env`
2. Cambiar `PORT=4000` a `PORT=4001`
3. Reiniciar backend

### ❌ Error: npm install falla

**Solución:**
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar
npm install
```

### ❌ Archivo CIG con errores

**Solución:**
- Verificar que cada línea tenga exactamente 300 caracteres
- Revisar logs en `backend/logs/error.log`
- Consultar `CIG_FORMAT_SPECIFICATION.md`

---

## 📊 ENDPOINTS PRINCIPALES

```
POST   /api/auth/login           # Iniciar sesión
GET    /api/lotes/active         # Obtener lote activo
POST   /api/records              # Agregar cheque
POST   /api/files/generate       # Generar archivo CIG
GET    /api/files                # Listar archivos
GET    /api/files/download/:id   # Descargar archivo
GET    /api/logs                 # Ver auditoría
```

Ver más en `API_DOCUMENTATION.md`

---

## 🚀 DESPLIEGUE EN PRODUCCIÓN

Para desplegar en un servidor:

1. Leer `PRODUCTION_DEPLOYMENT.md`
2. Configurar HTTPS con Let's Encrypt
3. Usar PM2 para mantener el servidor corriendo
4. Configurar backups automáticos
5. Habilitar monitoring

---

## 🧪 TESTING

```bash
cd backend
npm test
```

---

## 📞 SOPORTE

**Documentación:**
- Ver archivos .md en la raíz del proyecto
- Revisar código fuente comentado

**Logs:**
- Backend: `backend/logs/`
- Errores: `backend/logs/error.log`

**Base de datos:**
```bash
# Conectar a MongoDB
mongosh
use SntCont
db.users.find()  # Ver usuarios
db.check_records.find()  # Ver registros
```

---

## ✨ CARACTERÍSTICAS DESTACADAS

### 🤖 Autocompletado Inteligente
- Aprende de clientes frecuentes
- Sugiere datos mientras escribes
- Reduce errores de carga

### 📄 Generación Precisa
- Formato exacto de 300 caracteres por línea
- Validación automática
- Detección de errores

### 🔍 Auditoría Completa
- Registro de todas las acciones
- Filtros avanzados
- Exportable

### 🌙 Dark Mode
- Diseño moderno y elegante
- Reduce fatiga visual
- Accesibilidad WCAG AA

### 📱 100% Responsivo
- Funciona en desktop, tablet y móvil
- Adaptación automática
- Touch-friendly

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. ✅ **Cambiar contraseñas** de los usuarios de prueba
2. ✅ **Crear usuarios reales** desde el panel de administración
3. ✅ **Configurar backup automático** de la base de datos
4. ✅ **Revisar documentación** para funcionalidades avanzadas
5. ✅ **Probar flujo completo** de carga y generación

---

## 📝 NOTAS IMPORTANTES

- **Seguridad:** Cambiar `JWT_SECRET` en producción
- **Backups:** Configurar respaldos periódicos de MongoDB
- **HTTPS:** Obligatorio en producción
- **Logs:** Revisar periódicamente para detectar problemas
- **Actualizaciones:** Mantener dependencias actualizadas

---

## 🎉 ¡LISTO PARA USAR!

El sistema está **completamente funcional** y listo para:
- ✅ Cargar cheques
- ✅ Generar archivos CIG
- ✅ Descargar archivos
- ✅ Auditar operaciones
- ✅ Gestionar usuarios

**¡Disfruta tu nuevo sistema! 🚀**

---

## 📄 LICENCIA

Propietario - Todos los derechos reservados

---

**Desarrollado con ❤️ usando Node.js, React y MongoDB**

**Fecha:** Octubre 2025
