# Guía de Inicio Rápido - Sistema CIG

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0
- **npm** o **yarn**
- **Git** (opcional)

## 🚀 Instalación Rápida

### Windows

```bash
# Ejecutar el instalador automático
install.bat
```

### Linux/Mac

```bash
# Dar permisos de ejecución
chmod +x install.sh

# Ejecutar el instalador automático
./install.sh
```

### Instalación Manual

1. **Clonar o descargar el proyecto**
```bash
cd "APP CIG"
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

4. **Crear directorios necesarios**
```bash
mkdir -p data/exports/cig
mkdir -p logs
```

## 🗄️ Configuración de Base de Datos

1. **Iniciar MongoDB**
```bash
mongod
```

2. **Crear usuarios iniciales**
```bash
cd backend
node src/seed.js
```

Esto creará los siguientes usuarios:
- **admin** / admin123 (Administrador)
- **operador01** / operador123 (Operador)
- **auditor01** / auditor123 (Auditor)

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El backend correrá en `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
El frontend correrá en `http://localhost:3000`

### Modo Producción

**Con Docker:**
```bash
docker-compose up -d
```

**Con PM2:**
```bash
cd backend
npm install -g pm2
pm2 start ecosystem.config.js
```

## 🔑 Primer Acceso

1. Abrir navegador en `http://localhost:3000`
2. Iniciar sesión con:
   - **Usuario:** admin
   - **Contraseña:** admin123

## 📝 Flujo de Trabajo Básico

### 1. Cargar Cheques

1. Ir a "Cargar Cheques"
2. Completar el formulario con los datos del cheque
3. Click en "Agregar Cheque"
4. Repetir para agregar más cheques al lote

### 2. Generar Archivo CIG

1. Verificar los cheques en la tabla de vista previa
2. Click en "Generar Archivo TXT"
3. El sistema generará el archivo con formato de 300 caracteres por línea
4. Se cerrará el lote actual y se iniciará uno nuevo automáticamente

### 3. Descargar Archivos

1. Ir a "Archivos Generados"
2. Click en "Descargar" junto al archivo deseado
3. El archivo .TXT se descargará a tu computadora

### 4. Ver Auditoría (Admin/Auditor)

1. Ir a "Auditoría"
2. Filtrar por usuario, acción o fechas
3. Revisar el registro completo de actividades

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total: usuarios, cheques, archivos, auditoría |
| **Operador** | Cargar cheques, generar archivos, ver archivos |
| **Auditor** | Ver archivos, consultar auditoría (solo lectura) |

## 🗂️ Estructura del Archivo CIG

Cada línea del archivo .TXT tiene **exactamente 300 caracteres**:

- **Header (H)**: Información general del lote
- **Detalles (D)**: Un registro por cada cheque
- **Trailer (T)**: Totales y resumen

## 🔧 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongod --version

# Iniciar MongoDB
mongod
```

### Puerto 4000 o 3000 en uso
```bash
# Cambiar puerto en backend/.env
PORT=4001

# Cambiar puerto del frontend
# En frontend/package.json agregar:
# "start": "PORT=3001 react-scripts start"
```

### Error al generar archivo
- Verificar que la carpeta `data/exports/cig/` exista
- Verificar permisos de escritura
- Revisar logs en `backend/logs/`

## 📚 Endpoints API Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/lotes/active | Obtener lote activo |
| POST | /api/records | Agregar cheque |
| GET | /api/records/:loteId | Listar cheques del lote |
| POST | /api/files/generate | Generar archivo CIG |
| GET | /api/files | Listar archivos generados |
| GET | /api/files/download/:id | Descargar archivo |
| GET | /api/logs | Consultar auditoría |

## 📞 Soporte

Para más información, consultar:
- `README.md` - Documentación completa
- `backend/src/` - Código fuente del backend
- `frontend/src/` - Código fuente del frontend

## 🔄 Actualizar el Sistema

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🛡️ Seguridad

- **HTTPS**: Obligatorio en producción
- **JWT**: Tokens con expiración de 1 hora
- **Contraseñas**: Hasheadas con bcrypt
- **Auditoría**: Registro completo de acciones
- **Rate Limiting**: Protección contra fuerza bruta

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
# Backend logs
tail -f backend/logs/combined.log

# PM2 logs
pm2 logs cig-backend
```

---

**¡Sistema listo para usar! 🎉**
