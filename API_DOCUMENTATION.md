# API Documentation - Sistema CIG

## Base URL
```
http://localhost:4000/api
```

## Autenticación

Todos los endpoints (excepto `/auth/login`) requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## 🔐 Autenticación

### POST /auth/login
Iniciar sesión en el sistema.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "username": "admin",
    "email": "admin@cig.com",
    "role": "admin",
    "nombre": "Administrador",
    "apellido": "Sistema"
  }
}
```

### POST /auth/register
Crear nuevo usuario (solo admin).

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "operador",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

---

## 👤 Usuarios

### GET /users/me
Obtener datos del usuario autenticado.

**Response:**
```json
{
  "error": false,
  "user": {
    "id": "123abc",
    "username": "admin",
    "email": "admin@cig.com",
    "role": "admin",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "activo": true,
    "created_at": "2025-10-27T10:00:00.000Z",
    "last_login": "2025-10-27T15:30:00.000Z"
  }
}
```

### GET /users
Listar todos los usuarios (solo admin).

### PUT /users/:id
Actualizar usuario (solo admin).

---

## 📦 Lotes

### POST /lotes/new
Crear un nuevo lote.

**Roles:** admin, operador

**Response:**
```json
{
  "error": false,
  "message": "Lote creado exitosamente.",
  "lote": {
    "id": "L20251027-001",
    "created_by": "operador01",
    "created_at": "2025-10-27T16:00:00.000Z",
    "estado": "activo"
  }
}
```

### GET /lotes/active
Obtener el lote activo actual.

**Response:**
```json
{
  "error": false,
  "lote": {
    "id": "L20251027-001",
    "created_by": "operador01",
    "created_at": "2025-10-27T16:00:00.000Z",
    "estado": "activo"
  }
}
```

### POST /lotes/close
Cerrar el lote actual.

**Roles:** admin, operador

---

## 📝 Registros de Cheques

### POST /records
Agregar un cheque al lote activo.

**Roles:** admin, operador

**Request Body:**
```json
{
  "lote_id": "L20251027-001",
  "cliente": "CLIENTE EJEMPLO SA",
  "cuit": "30715225553",
  "importe": 125000.50,
  "moneda": "00",
  "fecha_vto": "2025-11-20",
  "tipo_documento": "PC",
  "identificacion_doc": "CHQ123456",
  "banco_emisor": "0017",
  "sucursal": "0250",
  "numero_cheque": "12345678",
  "observaciones": "Pago factura 001"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Cheque agregado exitosamente.",
  "record": {
    "_id": "abc123",
    "lote_id": "L20251027-001",
    "cliente": "CLIENTE EJEMPLO SA",
    "cuit": "30715225553",
    "importe": 125000.50,
    "estado": "pendiente",
    "created_at": "2025-10-27T16:05:00.000Z"
  }
}
```

### GET /records/:loteId
Obtener todos los cheques de un lote.

**Response:**
```json
{
  "error": false,
  "lote_id": "L20251027-001",
  "total_records": 5,
  "total_importe": 525000.00,
  "records": [...]
}
```

### DELETE /records/:id
Eliminar un cheque (solo si no está exportado).

**Roles:** admin, operador

### PUT /records/:id
Editar un cheque (solo si no está exportado).

**Roles:** admin, operador

---

## 📄 Archivos CIG

### POST /files/generate
Generar archivo CIG (.TXT).

**Roles:** admin, operador

**Request Body:**
```json
{
  "lote_id": "L20251027-001",
  "observaciones": "Lote de octubre"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Archivo generado exitosamente.",
  "file": {
    "id": "file123",
    "filename": "CIG_L20251027-001_20251027_160530.txt",
    "lote_id": "L20251027-001",
    "total_records": 5,
    "total_importe": 525000.00,
    "validado": true,
    "errores": []
  }
}
```

### GET /files
Listar archivos generados.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `user` (filtrar por usuario)
- `lote_id` (filtrar por lote)

**Response:**
```json
{
  "error": false,
  "files": [...],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

### GET /files/download/:id
Descargar archivo CIG.

**Response:** Archivo binario (.txt)

### DELETE /files/:id
Eliminar archivo (solo admin).

**Roles:** admin

---

## 👥 Clientes

### GET /clients
Buscar clientes (autocompletado).

**Query Parameters:**
- `q` - Búsqueda por CUIT o nombre

**Response:**
```json
{
  "error": false,
  "clients": [
    {
      "_id": "client123",
      "nombre": "CLIENTE EJEMPLO SA",
      "cuit": "30715225553",
      "frecuencia_uso": 15,
      "ultimo_uso": "2025-10-27T16:00:00.000Z"
    }
  ]
}
```

### GET /clients/:cuit
Obtener cliente por CUIT.

### POST /clients
Crear o actualizar cliente.

**Request Body:**
```json
{
  "nombre": "CLIENTE NUEVO SA",
  "cuit": "30123456789",
  "razon_social": "Cliente Nuevo Sociedad Anónima",
  "domicilio": "Av. Principal 123",
  "localidad": "Buenos Aires",
  "provincia": "Buenos Aires",
  "codigo_postal": "1000",
  "telefono": "011-4444-5555",
  "email": "contacto@clientenuevo.com"
}
```

---

## 📊 Auditoría

### GET /logs
Obtener logs de auditoría.

**Roles:** admin, auditor

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `user` - Filtrar por usuario
- `action` - Filtrar por acción
- `startDate` - Fecha desde
- `endDate` - Fecha hasta
- `status` - success | error | warning

**Response:**
```json
{
  "error": false,
  "logs": [
    {
      "_id": "log123",
      "user": "operador01",
      "action": "GENERATE_FILE",
      "timestamp": "2025-10-27T16:10:00.000Z",
      "details": {
        "lote_id": "L20251027-001",
        "filename": "CIG_L20251027-001_20251027_160530.txt",
        "total_records": 5
      },
      "status": "success"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 2
}
```

### GET /logs/stats
Obtener estadísticas de logs.

**Roles:** admin, auditor

### GET /logs/actions
Listar tipos de acciones disponibles.

**Roles:** admin, auditor

---

## 📋 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Petición incorrecta |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | No encontrado |
| 500 | Error del servidor |

---

## 🔒 Roles y Permisos

| Endpoint | admin | operador | auditor |
|----------|-------|----------|---------|
| POST /records | ✅ | ✅ | ❌ |
| POST /files/generate | ✅ | ✅ | ❌ |
| GET /files | ✅ | ✅ | ✅ |
| GET /logs | ✅ | ❌ | ✅ |
| POST /users | ✅ | ❌ | ❌ |

---

## 📝 Ejemplos de Uso

### Ejemplo completo: Crear lote y generar archivo

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'operador01',
    password: 'operador123'
  })
});
const { token } = await loginResponse.json();

// 2. Obtener lote activo
const loteResponse = await fetch('http://localhost:4000/api/lotes/active', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { lote } = await loteResponse.json();

// 3. Agregar cheques
await fetch('http://localhost:4000/api/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    lote_id: lote.id,
    cliente: 'EMPRESA XYZ SA',
    cuit: '30715225553',
    importe: 50000,
    moneda: '00',
    fecha_vto: '2025-12-31',
    tipo_documento: 'PC',
    identificacion_doc: 'CHQ001'
  })
});

// 4. Generar archivo
const fileResponse = await fetch('http://localhost:4000/api/files/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    lote_id: lote.id
  })
});
const { file } = await fileResponse.json();

// 5. Descargar archivo
window.location.href = `http://localhost:4000/api/files/download/${file.id}`;
```

---

Para más información, consultar el código fuente en `/backend/src/routes/`
