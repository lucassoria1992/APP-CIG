// const fs = require('fs').promises;
// const path = require('path');
// const logger = require('../utils/logger');

// // Función para padding genérica
// const pad = (val, len, char = ' ', left = true) => {
//   const str = String(val ?? '').substring(0, len);
//   return left ? str.padStart(len, char) : str.padEnd(len, char);
// };

// // Función para formatear fecha AAAAMMDD desde Date o 'YYYY-MM-DD'
// const formatDate = (date) => {
//   if (!date) return '';
//   if (typeof date === 'string' && date.length === 8 && /^\d{8}$/.test(date)) return date;
//   if (typeof date === 'string' && date.includes('-')) return date.replace(/-/g, '');
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${year}${month}${day}`;
// };

// const generateHeader = (numeroConvenio, fechaGeneracion, numeroArchivo, tipoPublicacion = ' ') => {
//   const fecha = new Date(fechaGeneracion);
//   const year = fecha.getFullYear();
//   const month = String(fecha.getMonth() + 1).padStart(2, '0');
//   const day = String(fecha.getDate()).padStart(2, '0');
//   const hours = String(fecha.getHours()).padStart(2, '0');
//   const minutes = String(fecha.getMinutes()).padStart(2, '0');
//   const seconds = String(fecha.getSeconds()).padStart(2, '0');

//   let line = '';
//   line += 'H';
//   line += pad(numeroConvenio, 10, '0');
//   line += `${year}${month}${day}`;
//   line += `${hours}${minutes}${seconds}`;
//   line += pad(numeroArchivo, 4, '0');
//   line += tipoPublicacion;
//   line += ' '.repeat(270);

//   if (line.length !== 300) {
//     throw new Error(`Header debe tener 300 caracteres, tiene ${line.length}`);
//   }

//   return line;
// };
// /**
//  * Genera el registro Detalle (D)
//  */
// const generateDetalle = (data) => {
//   // Helper para padding
//   const pad = (val, len, char = ' ', left = true) => {
//     val = val == null ? '' : String(val);
//     if (val.length > len) return val.substring(0, len);
//     return left ? val.padStart(len, char) : val.padEnd(len, char);
//   };

//   const f = data.cigFields || {};
//   const tipoDoc = (f.tipoDocumento || data.tipoDocumento || '').trim();
//   const isPC = tipoDoc === 'PC';

//   let line = '';
//   line += 'D'; // 1
//   line += pad(f.tipoIdentificacion || data.tipoIdentificacion, 4, ' ', false); // 2-5
//   line += pad(f.identificacionCliente || data.identificacionCliente, 15, ' ', false); // 6-20
//   line += pad(f.cuit || data.cuit, 11, '0', true); // 21-31
//   line += pad(f.tipoDocumento || data.tipoDocumento, 2, ' ', false); // 32-33
//   line += isPC ? ' '.repeat(25) : pad(f.idDocumento || data.idDocumento, 25, ' ', false); // 34-58
//   line += pad(f.fechaVigencia || data.fechaVigencia, 8, ' ', false); // 59-66
//   line += isPC ? ' '.repeat(15) : pad(f.importePrimerVencimiento || data.importePrimerVencimiento, 15, '0', true); // 67-81
//   line += pad(f.fechaPrimerVencimiento || data.fechaPrimerVencimiento, 8, ' ', false); // 82-89
//   line += isPC ? ' '.repeat(15) : pad(f.importeSegundoVencimiento || data.importeSegundoVencimiento, 15, '0', true); // 90-104
//   line += pad(f.fechaSegundoVencimiento || data.fechaSegundoVencimiento, 8, ' ', false); // 105-112
//   line += isPC ? ' '.repeat(15) : pad(f.importeTercerVencimiento || data.importeTercerVencimiento, 15, '0', true); // 113-127
//   line += pad(f.fechaTercerVencimiento || data.fechaTercerVencimiento, 8, ' ', false); // 128-135
//   line += pad(f.nombreCliente || data.nombreCliente, 30, ' ', false); // 136-165
//   line += pad(f.identificacionInterna || data.identificacionInterna, 30, ' ', false); // 166-195
//   line += pad(f.division || data.division, 6, ' ', false); // 196-201
//   line += pad(f.codMoneda || data.codMoneda, 2, '0', true); // 202-203
//   line += pad(f.leyenda1 || data.leyenda1, 38, ' ', false); // 204-241
//   line += pad(f.leyenda2 || data.leyenda2, 38, ' ', false); // 242-279
//   line += ' '.repeat(14); // 280-293
//   line += '.'; // 294 (posición 300)

//   // Si la línea es menor, rellenar con espacios antes del punto final
//   if (line.length < 300) {
//     line = line.slice(0, 299).padEnd(299, ' ') + '.';
//   }
//   if (line.length !== 300) {
//     throw new Error(`Detalle debe tener 300 caracteres, tiene ${line.length}`);
//   }
//   return line;
// }

// /**
//  * Genera el registro Trailer (T)
//  */
// const generateTrailer = (totalRecords, totalImporte) => {
//   const importeTotal = Math.round(parseFloat(totalImporte) * 100);

//   let line = '';
//   line += 'T';
//   line += pad(totalRecords, 9, '0');
//   line += pad(importeTotal, 15, '0');
//   line += ' '.repeat(274);
//   line += '.'; // Pos 300

//   if (line.length !== 300) {
//     throw new Error(`Trailer debe tener 300 caracteres, tiene ${line.length}`);
//   }

//   return line;
// };

// /**
//  * Genera el archivo completo CIG
//  */
// const generateCIGFile = async (loteId, records, filename, options = {}) => {
//   try {
//     if (!records || records.length === 0) {
//       throw new Error('No hay registros para generar el archivo');
//     }

//     const lines = [];
//     const fechaGeneracion = new Date();

//     const numeroConvenio = options.numeroConvenio || '2489';
//     const numeroArchivo = options.numeroArchivo || 1;
//     const tipoPublicacion = options.tipoPublicacion || ' ';

//     const cantidadDetalles = records.length;
//     const totalRegistros = cantidadDetalles + 2;
//     const totalImporte = records.reduce((sum, r) => sum + parseFloat(r.importe || 0), 0);

//     lines.push(generateHeader(numeroConvenio, fechaGeneracion, numeroArchivo, tipoPublicacion));

//     records.forEach((record) => {
//       lines.push(generateDetalle(record));
//     });

//     lines.push(generateTrailer(totalRegistros, totalImporte));

//     // Validar que todas las líneas tengan 300 caracteres
//     const invalidLines = [];
//     lines.forEach((line, idx) => {
//       if (line.length !== 300) {
//         const tipo = idx === 0 ? 'Header' : idx === lines.length - 1 ? 'Trailer' : `Detalle ${idx}`;
//         logger.error(`${tipo} (Línea ${idx + 1}) tiene ${line.length} caracteres en lugar de 300`);
//         invalidLines.push({ linea: idx + 1, tipo, longitud: line.length });
//       }
//     });

//     if (invalidLines.length > 0) {
//       throw new Error(`${invalidLines.length} líneas no tienen el formato correcto de 300 caracteres`);
//     }

//     const content = lines.join('\r\n');

//     const filesPath = path.resolve(process.env.FILES_PATH || '../data/exports/cig/');
//     await fs.mkdir(filesPath, { recursive: true });

//     const filepath = path.join(filesPath, filename);
//     await fs.writeFile(filepath, content, 'utf8');

//     logger.info(`Archivo CIG generado exitosamente: ${filename}`);

//     return {
//       filepath,
//       filename,
//       totalRecords,
//       totalImporte,
//       totalLines: lines.length,
//       validado: true
//     };

//   } catch (error) {
//     logger.error('Error al generar archivo CIG:', error);
//     throw error;
//   }
// };

// /**
//  * Validar archivo generado
//  */
// const validateCIGFile = async (filepath) => {
//   try {
//     const content = await fs.readFile(filepath, 'utf8');
//     const lines = content.split(/\r?\n/);

//     const errores = [];

//     lines.forEach((line, index) => {
//       if (line.length !== 300) {
//         errores.push({
//           linea: index + 1,
//           descripcion: `Línea tiene ${line.length} caracteres en lugar de 300`
//         });
//       }
//     });

//     if (lines.length < 3) {
//       errores.push({ linea: 0, descripcion: 'El archivo debe tener al menos Header, un Detalle y Trailer' });
//     }

//     if (lines[0][0] !== 'H') {
//       errores.push({ linea: 1, descripcion: 'La primera línea debe ser un Header (H)' });
//     }

//     if (lines[lines.length - 1][0] !== 'T') {
//       errores.push({ linea: lines.length, descripcion: 'La última línea debe ser un Trailer (T)' });
//     }

//     return { validado: errores.length === 0, errores };

//   } catch (error) {
//     logger.error('Error al validar archivo CIG:', error);
//     return { validado: false, errores: [{ linea: 0, descripcion: error.message }] };
//   }
// }



// cigGenerator.js - Generador de archivo de rendición de pagos CIG
// Basado en especificación "Diseño de registro CIG" páginas 16-27

const ARG_TZ = 'America/Argentina/Buenos_Aires';

// --- Funciones auxiliares ---
function pad(value, length, char = ' ', padLeft = true) {
  if (value === null || value === undefined) value = '';
  value = String(value);
  if (value.length > length) return value.slice(0, length);
  const padStr = char.repeat(length - value.length);
  return padLeft ? padStr + value : value + padStr;
}

function formatDateLocal(date) {
  if (!date) return '00000000';
  const d = new Date(date);
  if (isNaN(d)) return '00000000';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function formatTimeLocal(date) {
  if (!date) return '000000';
  const d = new Date(date);
  if (isNaN(d)) return '000000';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}${mm}${ss}`;
}

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return '0'.repeat(15);
  const n = parseFloat(amount);
  if (isNaN(n)) return '0'.repeat(15);
  const cents = Math.round(n * 100); // centavos
  const str = String(cents);
  return str.padStart(15, '0');
}

// --- Header (H) ---
function buildRendicionHeader(numeroConvenio, fechaGeneracion, numeroArchivo) {
  const fecha = formatDateLocal(fechaGeneracion);
  const hora = formatTimeLocal(fechaGeneracion);

  let line = '';
  line += 'H'; // pos 1
  line += pad(numeroConvenio, 10, '0', true); // pos 2-11
  line += fecha; // pos 12-19 (AAAAMMDD)
  line += hora; // pos 20-25 (HHMMSS)
  line += pad(numeroArchivo, 4, '0', true); // pos 26-29
  line += ' '.repeat(270); // pos 30-299 (Filler)
  line += '.'; // pos 300

  if (line.length !== 300) {
    throw new Error(`Header debe tener 300 caracteres, tiene ${line.length}`);
  }

  return line;
}

// --- Detalle (D) ---
function buildRendicionDetalle(data) {
  // Campos del detalle según especificación págs 19-23
  let line = '';

  // 1. Código de registro (pos 1)
  line += 'D';

  // 2. Tipo identificación cliente (2-5)
  line += pad(data.tipoIdentificacion || 'CUIT', 4, ' ', false);

  // 3. Identificación cliente (6-20)
  line += pad(data.identificacionCliente || '', 15, ' ', false);

  // 4. CUIT/CUIL (21-31, 11 chars, como en archivo real)
  line += pad(data.cuit || '', 11, ' ', false);
  // 5. Relleno hasta posición 38 (7 espacios)
  line += ' '.repeat(7);

  // 6. Tipo documento (39-40)
  line += pad(data.tipoDocumento || 'PC', 2, ' ', false);

  // 7. Identificación documento (41-65)
  const idDoc = (data.tipoDocumento === 'PC') ? '' : (data.idDocumento || '');
  line += pad(idDoc, 25, ' ', false);

  // 8. Identificación interna (66-95)
  line += pad(data.idInterna || '', 30, ' ', false);

  // 9. División (96-101)
  line += pad(data.division || '', 6, ' ', false);

  // 10. Código moneda (102-103)
  line += pad(data.codMoneda || '00', 2, '0', true);

  // 11. Fecha de pago (104-111)
  line += pad(data.fechaPago || '', 8, '0', true);

  // 12. Sucursal de pago (112-114)
  line += pad(data.sucursalPago || '', 3, '0', true);

  // 13. Forma de pago (115)
  line += pad(data.formaPago || '', 1, '0', true);

  // 14. Identificación del pago (116-124)
  line += pad(data.idPago || '', 9, ' ', false);

  // 15. Marca pago parcial (125)
  line += pad(data.pagoParcial || 'N', 1, ' ', false);

  // 16. Importe de pago (126-140) - igual al archivo real, no usar formatAmount
  line += pad(data.importePago || '', 15, '0', true);

  // Si es PC, los campos de cheque van con espacios
  if ((data.tipoDocumento || '').trim() === 'PC') {
    line += ' '.repeat(9); // Nº de cheque
    line += ' '.repeat(8); // Fecha acreditación
    line += ' '.repeat(15); // Importe cheque
    line += ' '.repeat(3); // Código banco
  } else {
    // Si es cheque diferido (tipoDocumento '3'), rellenar normalmente
    line += pad(data.nroCheque || '', 9, '0', true);
    line += pad(data.fechaAcred || '', 8, '0', true);
    line += pad(data.importeCheque || '', 15, '0', true);
    line += pad(data.codBanco || '', 3, '0', true);
  }

  // 21. Marca pago informado (176)
  line += pad(data.marcaInformado || 'N', 1, ' ', false);

  // 22. Marca pago anulado (177) - espacio si no hay valor
  line += pad(data.marcaAnulado || ' ', 1, ' ', false);

  // 23. Nº documento de pago (178-202)
  line += pad(data.docPago || '', 25, ' ', false);

  // 24. Tipo canal (203-204)
  line += pad(data.tipoCanal || '', 2, '0', true);

  // 25. Descripción canal (205-218)
  line += pad(data.descCanal || '', 14, ' ', false);

  // 26. Nº boleta CASH (219-227)
  line += pad(data.boletaCash || '', 9, '0', true);

  // 27. Filler (228-299)
  line += ' '.repeat(72);

  // 28. Fin de línea (300): punto
  line += '.';

  // Validación final
  if (line.length !== 300) {
    throw new Error(`Detalle debe tener 300 caracteres, tiene ${line.length}`);
  }

  return line;
}

// --- Trailer (T) ---
function buildRendicionTrailer(cantidadRegistros, totalCobrado) {
  let line = '';

  // 1. Código de registro (pos 1)
  line += 'T';

  // 2. Cantidad de registros (pos 2-10, 9 chars)
  // Incluye Header + Detalles + Trailer
  line += pad(cantidadRegistros, 9, '0', true);

  // 3. Total Cobrado (pos 11-25, 15 chars, 13 enteros + 2 decimales)
  // Incluye pagos anulados
  line += formatAmount(totalCobrado);

  // 4. Filler (pos 26-300, 275 chars)
  line += ' '.repeat(274);
  line += '.'; // pos 300

  if (line.length !== 300) {
    throw new Error(`Trailer debe tener 300 caracteres, tiene ${line.length}`);
  }

  return line;
}

// --- Generador del archivo completo ---
function generateRendicionFile(records, options = {}) {
  try {
    if (!records || records.length === 0) {
      throw new Error('No hay registros para generar el archivo');
    }

    const lines = [];
    const fechaGeneracion = new Date();

    const numeroConvenio = options.numeroConvenio || '0000002489';
    const numeroArchivo = options.numeroArchivo || 1;

    // Calcular totales
    const cantidadDetalles = records.length;
    const totalRegistros = cantidadDetalles + 2; // Header + Detalles + Trailer
    const totalCobrado = records.reduce((sum, r) => {
      return sum + parseFloat(r.importePago || 0);
    }, 0);

    // 1. Header
    lines.push(buildRendicionHeader(numeroConvenio, fechaGeneracion, numeroArchivo));

    // 2. Detalles
    records.forEach((record) => {
      lines.push(buildRendicionDetalle(record));
    });

    // 3. Trailer
    lines.push(buildRendicionTrailer(totalRegistros, totalCobrado));

    // Validar que todas las líneas tengan 300 caracteres
    const invalidLines = [];
    lines.forEach((line, idx) => {
      if (line.length !== 300) {
        const tipo = idx === 0 ? 'Header' : idx === lines.length - 1 ? 'Trailer' : `Detalle ${idx}`;
        invalidLines.push({ linea: idx + 1, tipo, longitud: line.length });
      }
    });

    if (invalidLines.length > 0) {
      throw new Error(`${invalidLines.length} líneas no tienen el formato correcto de 300 caracteres`);
    }

    // Unir con CRLF según especificación
    const content = lines.join('\r\n');

    return {
      content,
      totalRecords: totalRegistros,
      totalCobrado,
      totalLines: lines.length,
      validado: true
    };

  } catch (error) {
    console.error('Error al generar archivo de rendición CIG:', error);
    throw error;
  }
}

// --- Exportar funciones ---
module.exports = {
  buildRendicionHeader,
  buildRendicionDetalle,
  buildRendicionTrailer,
  generateRendicionFile,
  formatDateLocal,
  formatAmount
};

