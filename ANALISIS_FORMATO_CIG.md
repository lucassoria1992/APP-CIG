# 📋 Análisis Detallado - Formato CIG Real vs Generado

## Archivo Ejemplo Analizado: DEVINTEGRADA21102025.txt

### LÍNEA 1 - HEADER (H)
```
H0000002489202510200222233472                                                    [+270 espacios hasta 300]
```

**Estructura identificada:**
```
Pos 1:     H                    (Tipo registro)
Pos 2-11:  0000002489            (N° convenio - 10 dígitos)
Pos 12-19: 20251020              (Fecha AAAAMMDD - 8)
Pos 20-25: 022223               (Hora HHMMSS - 6)
Pos 26-29: 3472                  (N° archivo - 4)
Pos 30:    [espacio]             (Tipo publicación)
Pos 31-300: [270 espacios]       (Filler)
```

---

### LÍNEA 2 - DETALLE (D)
```
DCUIT30707895825    30707895825       PC                                                             00202510200004263699577N000000004608697                                   N                          12DIGITAL       000000000                                                                        .
```

**Análisis carácter por carácter:**

```
Pos 1:      D                        (Tipo registro)
Pos 2-5:    CUIT                     (Literal "CUIT" - 4 chars)
Pos 6-16:   30707895825              (CUIT número - 11 dígitos)
Pos 17-20:  [4 espacios]             (Separador)
Pos 21-31:  30707895825              (CUIT repetido - 11 dígitos)
Pos 32-38:  [7 espacios]             (Separador)
Pos 39-40:  PC                       (Tipo documento - 2)
Pos 41-107: [67 espacios]            (Varios campos vacíos)
Pos 108-108: 0                       (?)
Pos 109-109: 0                       (?)
Pos 110-117: 20251020                (Fecha - 8)
Pos 118-121: 0000                    (?)
Pos 122-135: 4263699577              (ID Documento? - 14)
Pos 136-136: N                       (Flag - 1)
Pos 137-151: 000000004608697        (Importe - 15: 000000004608697 = $46,086.97)
Pos 152-207: [varios campos]         (Datos adicionales)
Pos 208-208: N                       (Flag)
Pos 209-234: [espacios]              (Filler)
Pos 235-246: 12DIGITAL               (Texto literal - 12)
Pos 247-255: [espacios]              (Separador)
Pos 256-264: 000000000               (9 ceros)
Pos 265-299: [espacios]              (Filler)
Pos 300:    .                        (Punto final)
```

---

### LÍNEA FINAL - TRAILER (T)
```
T000000139000022320386447                                                       [+espacios hasta 300]
```

**Estructura identificada:**
```
Pos 1:      T                    (Tipo registro)
Pos 2-10:   000000139            (Cantidad total registros - 9 dígitos)
Pos 11-25:  000022320386447      (Total importe - 15: $223,203,864.47)
Pos 26-300: [275 espacios]       (Filler)
```

---

## 🔴 DIFERENCIAS CRÍTICAS CON NUESTRO FORMATO

### 1. HEADER

| Campo | Ejemplo Real | Nuestro Formato | ✅/❌ |
|-------|--------------|-----------------|-------|
| Pos 1 | H | H | ✅ |
| Pos 2-11 | N° convenio (10) | "COBRANZA" texto | ❌ |
| Pos 12-19 | Fecha AAAAMMDD | Fecha OK | ✅ |
| Pos 20-25 | Hora HHMMSS | **FALTA** | ❌ |
| Pos 26-29 | N° archivo (4) | **FALTA** | ❌ |
| Pos 30 | Tipo pub | **FALTA** | ❌ |
| Pos 31-300 | 270 espacios | Solo 245 | ❌ |

### 2. DETALLE

| Campo | Ejemplo Real | Nuestro Formato | ✅/❌ |
|-------|--------------|-----------------|-------|
| Pos 1 | D | D | ✅ |
| Pos 2-5 | Literal "CUIT" | Secuencia numérica | ❌ |
| Pos 6-16 | CUIT (11) | CUIT OK | ✅ |
| Pos 21-31 | CUIT repetido | Cliente texto | ❌ |
| Pos 39-40 | Tipo doc | Tipo doc | ✅ |
| Pos 110-117 | Fecha | Fecha vto | ? |
| Pos 137-151 | Importe (15) | Importe (13) | ❌ |
| Pos 300 | Punto "." | Sin punto | ❌ |

### 3. TRAILER

| Campo | Ejemplo Real | Nuestro Formato | ✅/❌ |
|-------|--------------|-----------------|-------|
| Pos 1 | T | T | ✅ |
| Pos 2-10 | Cant registros (9) | Cant (6) | ❌ |
| Pos 11-25 | Importe (15) | Importe (15) | ✅ |
| Pos 26-300 | 275 espacios | 278 espacios | ❌ |

---

## 🎯 FORMATO CORRECTO A IMPLEMENTAR

### Header (H) - 300 caracteres
```
H + N°Convenio(10) + FechaAAAAMMDD(8) + HoraHHMMSS(6) + N°Archivo(4) + TipoPub(1) + Filler(270)
```

### Detalle (D) - 300 caracteres  
**ESTRUCTURA COMPLEJA - Requiere mapeo exacto del archivo ejemplo**

Campos identificados:
- CUIT literal + CUIT número + CUIT repetido
- Tipo documento PC/CH
- Fecha en posición 110-117
- Importe 15 dígitos en posición 137-151
- Punto final en posición 300

### Trailer (T) - 300 caracteres
```
T + CantidadRegistros(9) + ImporteTotal(15) + Filler(275)
```

---

## ⚠️ OBSERVACIONES CRÍTICAS

1. **Punto final**: El archivo ejemplo termina cada línea con un punto "." en la posición 300
2. **CUIT duplicado**: En el detalle, el CUIT aparece dos veces
3. **Campos desconocidos**: Hay muchos campos entre la posición 40 y 136 que no están documentados
4. **Texto literal**: "12DIGITAL" aparece en posición 235-246

---

## 📝 RECOMENDACIÓN

**OPCIÓN 1**: Ingeniería inversa completa
- Analizar todas las 139 líneas del archivo ejemplo
- Mapear cada posición exacta
- Replicar el formato exacto

**OPCIÓN 2**: Solicitar especificación oficial
- Contactar con Banco Galicia
- Obtener documentación técnica del formato CIG
- Validar con archivo ejemplo

**OPCIÓN 3**: Formato simplificado
- Usar solo los campos obligatorios conocidos
- Probar si Galicia acepta formato mínimo
- Iterar según rechazo/aceptación

---

**Fecha de análisis**: 27 de octubre de 2025  
**Archivo analizado**: DEVINTEGRADA21102025.txt (139 registros)
