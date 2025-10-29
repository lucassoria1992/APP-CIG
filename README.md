# Sistema de Gestión de Archivos CIG (.TXT)

Sistema completo para la gestión, carga y generación de archivos CIG (Cobranza Integrada Galicia) en formato .TXT con estructura fija de 300 caracteres.

## 🚀 Características

- ✅ Carga múltiple de cheques en lotes
- 🤖 Autocompletado inteligente de clientes
- 📄 Generación de archivos .TXT válidos para Banco Galicia
- 🔐 Sistema de autenticación con JWT y roles
- 📊 Auditoría completa de operaciones
- 🌙 Dark mode obligatorio con accesibilidad WCAG AA
- 📱 100% Responsivo

## 📦 Tecnologías

**Frontend:**
- React 18
- React-Bootstrap
- Axios

**Backend:**
- Node.js + Express
- MongoDB
- JWT para autenticación
- Winston para logs

## 🛠️ Instalación

### Prerrequisitos
- Node.js >= 18
- MongoDB
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd "APP CIG"
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**

Crear archivo `.env` en la carpeta `backend`:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/SntCont
JWT_SECRET=tu_clave_secreta_muy_segura
FILES_PATH=../data/exports/cig/
LOG_LEVEL=info
TOKEN_EXPIRES=1h
```

5. **Iniciar MongoDB**
```bash
mongod
```

6. **Iniciar el backend**
```bash
cd backend
npm run dev
```

7. **Iniciar el frontend**
```bash
cd frontend
npm start
```

## 👥 Roles de Usuario

- **admin**: Control total del sistema
- **operador**: Carga y generación de archivos
- **auditor**: Consulta de logs y descargas

## 📝 Estructura del Archivo CIG

Cada línea del archivo .TXT tiene exactamente **300 caracteres**:
- Header: Información general del archivo
- Detalles (D): Información de cada cheque
- Detalle II (E): Información adicional (opcional)
- Trailer: Totales y cierre

## 🔐 Seguridad

- Autenticación JWT
- Control de roles y permisos
- Auditoría completa de acciones
- HTTPS obligatorio en producción
- Rate limiting en endpoints sensibles

## 📊 Base de Datos

**Colecciones MongoDB:**
- `users`: Usuarios del sistema
- `clients`: Clientes frecuentes
- `check_records`: Cheques por lote
- `generated_files`: Historial de archivos generados
- `user_logs`: Auditoría de actividades

## 🐳 Docker

```bash
docker-compose up -d
```

## � Actualización de Dependencias

Para actualizar todas las dependencias a las últimas versiones:

```bash
# Windows
update.bat

# Linux/Mac
./update.sh
```

Ver [CHANGELOG_DEPENDENCIES.md](CHANGELOG_DEPENDENCIES.md) para detalles de las actualizaciones.

## 📚 Documentación Adicional

- 📖 [CHANGELOG_DEPENDENCIES.md](CHANGELOG_DEPENDENCIES.md) - Historial de actualizaciones
- 📖 [LEEME.md](LEEME.md) - Guía rápida en español
- 📖 [QUICK_START.md](QUICK_START.md) - Inicio rápido
- 📖 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API completa
- 📖 [CIG_FORMAT_SPECIFICATION.md](CIG_FORMAT_SPECIFICATION.md) - Formato CIG
- 📖 [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Para desarrolladores
- 📖 [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - Despliegue
- 📖 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumen ejecutivo
- 📖 [PROJECT_STATS.md](PROJECT_STATS.md) - Estadísticas del proyecto

## �📄 Licencia

Propietario - Todos los derechos reservados
