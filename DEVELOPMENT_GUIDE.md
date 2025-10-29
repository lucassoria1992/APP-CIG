# Sistema de Gestión de Archivos CIG - Guía de Desarrollo

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Base de Datos:** MongoDB 5.0+
- **ORM:** Mongoose 8.x
- **Autenticación:** JWT (jsonwebtoken)
- **Seguridad:** bcryptjs, helmet
- **Logging:** Winston
- **Testing:** Jest

### Frontend
- **Framework:** React 18.2
- **UI Library:** React-Bootstrap 5.3
- **HTTP Client:** Axios
- **Routing:** React Router DOM 6.x
- **Date Utils:** date-fns 3.x

## 📁 Estructura del Proyecto

```
APP CIG/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   └── audit.js         # Logging middleware
│   │   ├── models/
│   │   │   ├── User.js          # Usuario
│   │   │   ├── Client.js        # Cliente
│   │   │   ├── CheckRecord.js   # Registro de cheque
│   │   │   ├── GeneratedFile.js # Archivo generado
│   │   │   └── UserLog.js       # Log de auditoría
│   │   ├── routes/
│   │   │   ├── auth.js          # Autenticación
│   │   │   ├── users.js         # Gestión de usuarios
│   │   │   ├── lotes.js         # Gestión de lotes
│   │   │   ├── records.js       # Registros de cheques
│   │   │   ├── files.js         # Archivos generados
│   │   │   ├── clients.js       # Clientes
│   │   │   └── logs.js          # Auditoría
│   │   ├── utils/
│   │   │   ├── cigGenerator.js  # Generador de archivos CIG
│   │   │   └── logger.js        # Winston logger
│   │   ├── server.js            # Servidor principal
│   │   └── seed.js              # Datos iniciales
│   ├── tests/
│   │   └── cigGenerator.test.js # Tests
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js    # Barra de navegación
│   │   │   └── PrivateRoute.js  # Ruta protegida
│   │   ├── context/
│   │   │   └── AuthContext.js   # Context de autenticación
│   │   ├── pages/
│   │   │   ├── LoginPage.js     # Login
│   │   │   ├── Dashboard.js     # Dashboard
│   │   │   ├── ChequesPage.js   # Carga de cheques
│   │   │   ├── FilesPage.js     # Archivos generados
│   │   │   ├── AuditPage.js     # Auditoría
│   │   │   └── UsersPage.js     # Gestión de usuarios
│   │   ├── services/
│   │   │   └── api.js           # Axios instance
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css            # Dark mode styles
│   ├── package.json
│   └── Dockerfile
├── data/
│   └── exports/
│       └── cig/                 # Archivos CIG generados
├── logs/                        # Logs de la aplicación
├── docker-compose.yml
├── README.md
├── QUICK_START.md
├── API_DOCUMENTATION.md
└── CIG_FORMAT_SPECIFICATION.md
```

## 🔧 Configuración del Entorno

### Variables de Entorno (Backend)

Crear archivo `backend/.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/SntCont

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
TOKEN_EXPIRES=1h

# Files
FILES_PATH=../data/exports/cig/

# Logging
LOG_LEVEL=info
```

### Variables de Entorno (Frontend)

Crear archivo `frontend/.env` (opcional):

```env
REACT_APP_API_URL=http://localhost:4000/api
```

## 🚀 Comandos de Desarrollo

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Tests
npm test

# Coverage
npm test -- --coverage

# Linting
npm run lint

# Crear usuarios iniciales
node src/seed.js
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Eject (no recomendado)
npm run eject
```

## 📊 Modelos de Datos

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'operador' | 'auditor',
  nombre: String,
  apellido: String,
  activo: Boolean,
  created_at: Date,
  last_login: Date
}
```

### Client
```javascript
{
  nombre: String,
  cuit: String (11 dígitos, unique),
  razon_social: String,
  domicilio: String,
  localidad: String,
  provincia: String,
  codigo_postal: String,
  telefono: String,
  email: String,
  frecuencia_uso: Number,
  ultimo_uso: Date,
  created_at: Date,
  created_by: String
}
```

### CheckRecord
```javascript
{
  lote_id: String,
  cliente: String,
  cuit: String (11 dígitos),
  importe: Number,
  moneda: '00' | '01',
  fecha_vto: Date,
  tipo_documento: 'PC' | 'CH' | 'FC',
  identificacion_doc: String,
  banco_emisor: String,
  sucursal: String,
  numero_cheque: String,
  estado: 'pendiente' | 'exportado' | 'anulado',
  observaciones: String,
  created_by: String,
  created_at: Date,
  exported_at: Date,
  exported_by: String
}
```

### GeneratedFile
```javascript
{
  filename: String (unique),
  lote_id: String,
  filepath: String,
  total_records: Number,
  total_importe: Number,
  fecha_generacion: Date,
  user: String,
  observaciones: String,
  validado: Boolean,
  errores: [{
    linea: Number,
    descripcion: String
  }]
}
```

### UserLog
```javascript
{
  user: String,
  action: 'LOGIN' | 'LOGOUT' | 'CREATE_LOTE' | ...,
  timestamp: Date,
  details: Object,
  ip_address: String,
  user_agent: String,
  status: 'success' | 'error' | 'warning',
  error_message: String
}
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Login:** POST `/api/auth/login`
   - Recibe username y password
   - Valida credenciales
   - Genera token JWT
   - Retorna token y datos del usuario

2. **Middleware de Verificación:**
   ```javascript
   verifyToken → verifyRole(['admin', 'operador'])
   ```

3. **Token en Headers:**
   ```javascript
   Authorization: Bearer <token>
   ```

### Roles y Permisos

| Recurso | admin | operador | auditor |
|---------|-------|----------|---------|
| Usuarios | CRUD | - | - |
| Lotes | CRUD | CR | R |
| Cheques | CRUD | CRUD | R |
| Archivos | CRUD | CRD | R |
| Logs | R | - | R |

## 📝 Generación de Archivos CIG

### Proceso de Generación

1. **Validar Lote:**
   - Verificar que existan registros pendientes
   - Validar datos de cada registro

2. **Generar Contenido:**
   ```
   Header (H) → 1 línea de 300 caracteres
   Detalles (D) → N líneas de 300 caracteres
   Trailer (T) → 1 línea de 300 caracteres
   ```

3. **Validar Archivo:**
   - Verificar longitud de cada línea (300 chars)
   - Verificar estructura (H → D* → T)
   - Validar totales

4. **Guardar Metadata:**
   - Registrar en `GeneratedFile`
   - Marcar registros como exportados
   - Cerrar lote actual

5. **Generar Nuevo Lote:**
   - Crear lote vacío automáticamente

### Funciones Principales

```javascript
// cigGenerator.js
generateCIGFile(loteId, records, filename)
validateCIGFile(filepath)
formatField(value, length, align, fillChar)
formatNumber(value, totalLength, decimals)
formatDate(date)
```

## 🎨 Estilos y UI

### Dark Mode (Obligatorio)

Variables CSS:
```css
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--bg-tertiary: #3a3a3a
--text-primary: #e0e0e0
--text-secondary: #b0b0b0
--accent-primary: #4a9eff
```

### Accesibilidad WCAG AA

- ✅ Contraste mínimo 4.5:1
- ✅ Tamaño de fuente legible (16px+)
- ✅ Touch targets 44x44px mínimo
- ✅ Focus visible
- ✅ Navegación por teclado
- ✅ ARIA labels

## 🧪 Testing

### Tests Unitarios

```bash
# Backend
cd backend
npm test

# Ejecutar test específico
npm test -- cigGenerator.test.js

# Con coverage
npm test -- --coverage
```

### Tests de Integración

```javascript
// Ejemplo: Test de endpoint
const request = require('supertest');
const app = require('../src/server');

describe('POST /api/auth/login', () => {
  it('debe autenticar usuario válido', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

## 🐳 Docker

### Development

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Production

```bash
# Build optimizado
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Monitoreo y Logs

### Winston Logger

```javascript
const logger = require('./utils/logger');

logger.info('Información general');
logger.warn('Advertencia');
logger.error('Error', { error: err });
```

### PM2

```bash
# Iniciar con PM2
pm2 start ecosystem.config.js

# Ver status
pm2 status

# Ver logs
pm2 logs cig-backend

# Reiniciar
pm2 restart cig-backend

# Detener
pm2 stop cig-backend
```

## 🔄 Workflow de Desarrollo

1. **Feature Branch:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollo:**
   - Escribir código
   - Escribir tests
   - Verificar linting

3. **Commit:**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

4. **Push y PR:**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

5. **Review y Merge:**
   - Code review
   - Tests pasando
   - Merge a main/master

## 📦 Deployment

### Checklist Pre-Deploy

- [ ] Tests pasando
- [ ] Variables de entorno configuradas
- [ ] MongoDB configurado
- [ ] HTTPS habilitado
- [ ] JWT_SECRET cambiado
- [ ] Rate limiting configurado
- [ ] Logs configurados
- [ ] Backup de DB configurado

### Deploy Steps

1. **Build Backend:**
   ```bash
   cd backend
   npm install --production
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Iniciar con PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

## 🆘 Troubleshooting

### Backend no inicia
- Verificar MongoDB corriendo
- Verificar puerto 4000 disponible
- Revisar logs en `backend/logs/`

### Frontend no conecta
- Verificar REACT_APP_API_URL
- Verificar CORS en backend
- Revisar consola del navegador

### Archivos CIG inválidos
- Verificar longitud de líneas (300 chars)
- Revisar `GeneratedFile.errores`
- Ejecutar `validateCIGFile()`

---

**Happy Coding! 🚀**
