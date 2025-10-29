# Formato del Archivo CIG (.TXT)

## Especificación Técnica

**Banco Galicia - Cobranza Integrada Galicia (CIG)**

### Características Generales

- **Extensión:** .TXT
- **Codificación:** UTF-8 sin BOM
- **Longitud de línea:** **300 caracteres exactos** (obligatorio)
- **Separador de línea:** CR+LF (`\r\n`)
- **Estructura:** Header + Detalles + Trailer

---

## Estructura del Archivo

```
┌─────────────────────────────────────┐
│  H (Header)          - 1 línea      │
├─────────────────────────────────────┤
│  D (Detalle 1)       - N líneas     │
│  D (Detalle 2)                      │
│  ...                                │
│  D (Detalle N)                      │
├─────────────────────────────────────┤
│  T (Trailer)         - 1 línea      │
└─────────────────────────────────────┘
```

---

## 1. HEADER (H) - Registro de Cabecera

**Tipo:** H  
**Longitud:** 300 caracteres

| Campo | Posición | Longitud | Tipo | Formato | Descripción |
|-------|----------|----------|------|---------|-------------|
| Tipo de Registro | 1-1 | 1 | A | Fijo | "H" |
| Descripción | 2-21 | 20 | A | Izq | "COBRANZA" |
| Número de Lote | 22-41 | 20 | A | Izq | ID del lote (ej: "L20251027-001") |
| Fecha Generación | 42-49 | 8 | N | AAAAMMDD | Fecha de generación |
| Cantidad Registros | 50-55 | 6 | N | Derecha con ceros | Total de registros D |
| Espacios | 56-300 | 245 | A | Espacios | Relleno con espacios |

**Ejemplo:**
```
H COBRANZA            L20251027-001       20251027000015                                                                                                                                                                                                                                             
```

---

## 2. DETALLE (D) - Registro de Cheque

**Tipo:** D  
**Longitud:** 300 caracteres

| Campo | Posición | Longitud | Tipo | Formato | Descripción |
|-------|----------|----------|------|---------|-------------|
| Tipo de Registro | 1-1 | 1 | A | Fijo | "D" |
| Número Secuencia | 2-7 | 6 | N | Derecha con ceros | Secuencial desde 000001 |
| CUIT | 8-18 | 11 | N | Derecha | CUIT sin guiones (11 dígitos) |
| Nombre Cliente | 19-58 | 40 | A | Izquierda | Nombre completo o razón social |
| Tipo Documento | 59-60 | 2 | A | Fijo | PC=Pagaré, CH=Cheque, FC=Factura |
| Identificación Doc | 61-80 | 20 | A | Izquierda | Número de documento |
| Fecha Vencimiento | 81-88 | 8 | N | AAAAMMDD | Fecha de vencimiento |
| Importe | 89-101 | 13 | N | Derecha con ceros | Sin decimales (ej: 12500050 = $125000.50) |
| Moneda | 102-103 | 2 | N | Fijo | 00=Pesos, 01=Dólares |
| Banco Emisor | 104-107 | 4 | A | Izquierda | Código de banco |
| Sucursal | 108-111 | 4 | A | Izquierda | Código de sucursal |
| Número Cheque | 112-121 | 10 | A | Izquierda | Número de cheque |
| Espacios | 122-300 | 179 | A | Espacios | Relleno con espacios |

**Ejemplo:**
```
D 00000130715225553 CLIENTE DIGITAL SA                  PC CHQ123456          202511200000012500050000017 0250 12345678                                                                                                                                  
```

**Cálculo del Importe:**
- Importe real: $125,000.50
- Multiplicar por 100: 12,500,050
- Formatear a 13 dígitos: "0000012500050"

---

## 3. TRAILER (T) - Registro de Cierre

**Tipo:** T  
**Longitud:** 300 caracteres

| Campo | Posición | Longitud | Tipo | Formato | Descripción |
|-------|----------|----------|------|---------|-------------|
| Tipo de Registro | 1-1 | 1 | A | Fijo | "T" |
| Cantidad Registros | 2-7 | 6 | N | Derecha con ceros | Total de registros D |
| Importe Total | 8-22 | 15 | N | Derecha con ceros | Suma de todos los importes |
| Espacios | 23-300 | 278 | A | Espacios | Relleno con espacios |

**Ejemplo:**
```
T 000015000000525000000                                                                                                                                                                                                                                                                           
```

---

## Ejemplo Completo de Archivo

```txt
H COBRANZA            L20251027-001       20251027000003                                                                                                                                                                                                                                             
D 00000130715225553 EMPRESA ABC SA                      PC DOC001             202512310000010000000000017 0001 00123456                                                                                                                                  
D 00000230715225554 EMPRESA XYZ SRL                     CH CHQ002             202512250000005000000000017 0002 00789012                                                                                                                                  
D 00000330715225555 COMERCIO 123                        FC FAC003             202512200000002500000000017 0003 00345678                                                                                                                                  
T 000003000000017500000                                                                                                                                                                                                                                                                           
```

**Desglose:**
- Header: 1 línea
- Detalles: 3 líneas (3 cheques)
- Trailer: 1 línea
- **Total: 5 líneas de 300 caracteres cada una**

---

## Reglas de Validación

### ✅ Validaciones Obligatorias

1. **Longitud exacta:** Cada línea debe tener exactamente 300 caracteres
2. **Tipo de registro:** Primer carácter debe ser H, D o T
3. **Secuencia:** Un Header, N Detalles, un Trailer
4. **Campos numéricos:** Rellenados con ceros a la izquierda
5. **Campos alfanuméricos:** Rellenados con espacios a la derecha
6. **CUIT:** 11 dígitos numéricos
7. **Fechas:** Formato AAAAMMDD
8. **Importe:** Sin punto decimal, multiplicado por 100

### ❌ Errores Comunes

- Líneas con longitud incorrecta (< 300 o > 300)
- Campos numéricos con espacios
- Fechas inválidas o con formato incorrecto
- CUIT con longitud incorrecta
- Importes mal calculados
- Falta de Header o Trailer
- Totales del Trailer que no coinciden

---

## Código de Ejemplo (Generación)

```javascript
// Formatear campo alfanumérico (izquierda + espacios)
function formatAlpha(value, length) {
  return String(value || '').substring(0, length).padEnd(length, ' ');
}

// Formatear campo numérico (derecha + ceros)
function formatNumber(value, length) {
  return String(value || '').substring(0, length).padStart(length, '0');
}

// Formatear importe (multiplicar por 100)
function formatAmount(value, length) {
  const cents = Math.round(parseFloat(value) * 100);
  return String(cents).padStart(length, '0');
}

// Formatear fecha AAAAMMDD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Generar línea de Detalle
function generateDetail(record, sequence) {
  let line = '';
  line += 'D';                                        // Tipo (1)
  line += formatNumber(sequence, 6);                  // Secuencia (6)
  line += formatAlpha(record.cuit, 11);              // CUIT (11)
  line += formatAlpha(record.cliente, 40);           // Cliente (40)
  line += formatAlpha(record.tipo_documento, 2);     // Tipo Doc (2)
  line += formatAlpha(record.identificacion_doc, 20); // ID Doc (20)
  line += formatDate(record.fecha_vto);              // Fecha (8)
  line += formatAmount(record.importe, 13);          // Importe (13)
  line += formatAlpha(record.moneda || '00', 2);     // Moneda (2)
  line += formatAlpha(record.banco_emisor || '', 4); // Banco (4)
  line += formatAlpha(record.sucursal || '', 4);     // Sucursal (4)
  line += formatAlpha(record.numero_cheque || '', 10); // Cheque (10)
  line += formatAlpha('', 179);                      // Espacios (179)
  
  // TOTAL: 1+6+11+40+2+20+8+13+2+4+4+10+179 = 300
  
  if (line.length !== 300) {
    throw new Error(`Línea debe tener 300 caracteres, tiene ${line.length}`);
  }
  
  return line;
}
```

---

## Verificación Post-Generación

### Checklist de Validación

- [ ] Archivo tiene extensión .TXT
- [ ] Cada línea tiene exactamente 300 caracteres
- [ ] Primera línea comienza con "H"
- [ ] Última línea comienza con "T"
- [ ] Cantidad de líneas D coincide con Header y Trailer
- [ ] Suma de importes coincide con Trailer
- [ ] No hay caracteres especiales no permitidos
- [ ] Codificación es UTF-8
- [ ] Saltos de línea son CR+LF

---

## Herramientas de Verificación

### Verificar longitud de líneas (Linux/Mac)
```bash
awk '{ print length }' archivo.txt
```

### Verificar longitud de líneas (Windows - PowerShell)
```powershell
Get-Content archivo.txt | ForEach-Object { $_.Length }
```

### Contar registros
```bash
# Header
grep -c "^H" archivo.txt

# Detalles
grep -c "^D" archivo.txt

# Trailer
grep -c "^T" archivo.txt
```

---

## Notas Importantes

1. **Sin BOM:** El archivo NO debe tener marca de orden de bytes (BOM)
2. **Caracteres permitidos:** Alfanuméricos, espacios, números
3. **Sin tildes:** Evitar acentos y caracteres especiales
4. **Nombres de archivo:** Usar formato descriptivo (ej: `CIG_LOTE_FECHA.txt`)
5. **Backup:** Mantener copia de todos los archivos generados
6. **Auditoría:** Registrar quién y cuándo generó cada archivo

---

## Soporte

Para dudas sobre el formato CIG, contactar:
- Mesa de ayuda Banco Galicia
- Documentación oficial del banco
- Equipo técnico de desarrollo

---

**Última actualización:** Octubre 2025
