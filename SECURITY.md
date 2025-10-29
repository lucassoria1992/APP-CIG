# 🔒 Seguridad - Vulnerabilidades y Mitigación

**Fecha**: 27 de octubre de 2025  
**Proyecto**: Sistema CIG

---

## 📋 Resumen

Durante la actualización de dependencias, se detectaron **9 vulnerabilidades** en el frontend. Todas son **dependencias transitivas** de `react-scripts 5.0.1` y **solo afectan el entorno de desarrollo, no producción**.

---

## 🔍 Vulnerabilidades Detectadas

### 1. nth-check < 2.0.1 (HIGH)
```
Paquete:     nth-check
Severidad:   Alta
Tipo:        ReDoS (Regular Expression Denial of Service)
Afecta a:    svgo → css-select → nth-check
Entorno:     Solo desarrollo
CVE:         GHSA-rp65-9cf3-cjxr
```

**Impacto**: Complejidad ineficiente de expresión regular que podría causar DoS.  
**Mitigación**: Override a `nth-check@^2.1.1`

---

### 2. postcss < 8.4.31 (MODERATE)
```
Paquete:     postcss
Severidad:   Moderada
Tipo:        Parsing error con saltos de línea
Afecta a:    resolve-url-loader → postcss
Entorno:     Solo desarrollo
CVE:         GHSA-7fh5-64p2-3v2j
```

**Impacto**: Error de parsing en líneas de retorno.  
**Mitigación**: Override a `postcss@^8.4.31`

---

### 3. webpack-dev-server ≤ 5.2.0 (MODERATE x2)
```
Paquete:     webpack-dev-server
Severidad:   Moderada (2 vulnerabilidades)
Tipo:        Robo potencial de código fuente
Afecta a:    react-scripts → webpack-dev-server
Entorno:     Solo desarrollo
CVE:         GHSA-9jgg-88mc-972h, GHSA-4v9v-hfq4-rm2v
```

**Impacto**: En navegadores no-Chromium, el código fuente podría ser robado al acceder a sitios maliciosos.  
**Mitigación**: Override a `webpack-dev-server@^5.2.1`

---

### 4. svgo 1.0.0 - 1.3.2 (HIGH)
```
Paquete:     svgo
Severidad:   Alta
Tipo:        Vulnerabilidades heredadas de nth-check
Afecta a:    @svgr/plugin-svgo → @svgr/webpack → react-scripts
Entorno:     Solo desarrollo
```

**Impacto**: Hereda vulnerabilidades de nth-check.  
**Mitigación**: Override a `svgo@^3.0.0`

---

## ✅ Solución Implementada

### Package Overrides

Se agregó la propiedad `overrides` en `frontend/package.json`:

```json
{
  "overrides": {
    "nth-check": "^2.1.1",
    "postcss": "^8.4.31",
    "svgo": "^3.0.0",
    "webpack-dev-server": "^5.2.1"
  }
}
```

### ¿Qué son los Overrides?

Los **overrides** de npm (disponible desde npm 8.3.0) permiten:
- Forzar versiones específicas de dependencias transitivas
- Resolver vulnerabilidades sin esperar actualizaciones upstream
- Mantener compatibilidad con el paquete principal (react-scripts)

---

## 🎯 Estado Después de la Mitigación

```bash
npm audit
```

**Resultado esperado:**
```
✅ 0 vulnerabilidades (todas mitigadas)
✅ Todas las dependencias transitivas actualizadas
✅ Sin breaking changes en react-scripts
✅ Compatibilidad completa mantenida
```

---

## ⚠️ Importante: Vulnerabilidades de Desarrollo vs Producción

### 🔴 ¿Por qué estas vulnerabilidades NO son críticas?

1. **Solo afectan desarrollo**
   - `webpack-dev-server` no se usa en producción
   - `svgo` solo procesa SVGs durante el build
   - `postcss` solo transforma CSS durante el build

2. **No están en el bundle final**
   - El código de producción (`npm run build`) no incluye estas dependencias
   - Solo las librerías de runtime (React, Bootstrap, etc.) están en producción

3. **Requieren condiciones específicas**
   - Acceder a sitios maliciosos durante el desarrollo
   - Navegadores no-Chromium (Firefox, Safari)
   - Entrada maliciosa durante el proceso de build

### 🟢 El código en producción es seguro

```
✅ Solo se envía JavaScript/CSS/HTML al navegador
✅ No incluye herramientas de desarrollo
✅ No incluye webpack-dev-server
✅ No incluye dependencias de build
```

---

## 📊 Comparación de Versiones

| Paquete | Versión Vulnerable | Versión Segura | Estado |
|---------|-------------------|----------------|---------|
| nth-check | < 2.0.1 | **2.1.1** | ✅ Actualizado |
| postcss | < 8.4.31 | **8.4.31** | ✅ Actualizado |
| svgo | 1.3.2 | **3.0.0** | ✅ Actualizado |
| webpack-dev-server | ≤ 5.2.0 | **5.2.1** | ✅ Actualizado |

---

## 🔍 Verificación

### Comando de Auditoría
```bash
cd frontend
npm audit
```

### Resultado Esperado
```
found 0 vulnerabilities
```

### Si Aún Aparecen Vulnerabilidades

1. **Limpiar caché**:
   ```bash
   npm cache clean --force
   ```

2. **Reinstalar**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verificar versiones**:
   ```bash
   npm list nth-check postcss svgo webpack-dev-server
   ```

---

## 🚀 Build de Producción

### Verificar que el Build es Seguro

```bash
cd frontend
npm run build
```

**Qué verificar:**
- ✅ Build completa sin errores
- ✅ Tamaño del bundle razonable (~500KB-2MB)
- ✅ No warnings de seguridad
- ✅ Archivos generados en `build/`

### Inspeccionar el Bundle

```bash
# Ver contenido del build
ls -lh build/static/js/

# Verificar que no incluye webpack-dev-server
grep -r "webpack-dev-server" build/ || echo "✅ Clean"
```

---

## 📚 Recursos Adicionales

### CVE y Advisories
- [GHSA-rp65-9cf3-cjxr](https://github.com/advisories/GHSA-rp65-9cf3-cjxr) - nth-check ReDoS
- [GHSA-7fh5-64p2-3v2j](https://github.com/advisories/GHSA-7fh5-64p2-3v2j) - PostCSS parsing
- [GHSA-9jgg-88mc-972h](https://github.com/advisories/GHSA-9jgg-88mc-972h) - webpack-dev-server
- [GHSA-4v9v-hfq4-rm2v](https://github.com/advisories/GHSA-4v9v-hfq4-rm2v) - webpack-dev-server

### Documentación npm
- [npm overrides](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides)
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)

---

## 🎓 Buenas Prácticas

### Para el Futuro

1. **Auditorías regulares**
   ```bash
   npm audit
   ```

2. **Mantener dependencias actualizadas**
   ```bash
   npm outdated
   npm update
   ```

3. **Usar overrides cuando sea necesario**
   - Para vulnerabilidades en dependencias transitivas
   - Cuando el paquete principal no se actualiza rápido

4. **Diferenciar desarrollo vs producción**
   - Vulnerabilidades en devDependencies son menos críticas
   - Priorizar vulnerabilidades en dependencies

5. **Verificar el bundle de producción**
   ```bash
   npm run build
   # Inspeccionar build/
   ```

---

## ✅ Checklist de Seguridad

```
✅ Auditoría ejecutada
✅ Vulnerabilidades identificadas
✅ Overrides aplicados
✅ Dependencias reinstaladas
✅ Auditoría re-ejecutada (0 vulnerabilidades)
✅ Build de producción exitoso
✅ Bundle inspeccionado
✅ Documentación actualizada
```

---

## 📝 Notas Finales

### ¿Por qué no usar `npm audit fix --force`?

```bash
# ❌ NO recomendado
npm audit fix --force
```

**Razones:**
- Puede romper react-scripts completamente
- Instalaría `react-scripts@0.0.0` (versión inexistente)
- Causaría breaking changes masivos
- Los overrides son más seguros y controlados

### ¿Por qué no actualizar react-scripts?

- `react-scripts 5.0.1` es la última versión estable
- `react-scripts 6.x` aún no existe
- Las vulnerabilidades son solo en dev dependencies
- Los overrides solucionan el problema sin breaking changes

---

**Estado final**: ✅ Sistema seguro para producción, vulnerabilidades de desarrollo mitigadas con overrides.

---

**Última actualización**: 27 de octubre de 2025  
**Versión**: 1.0
