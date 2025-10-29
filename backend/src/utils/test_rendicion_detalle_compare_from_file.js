// test_rendicion_detalle_compare_from_file.js
const { buildRendicionDetalle } = require('./cigGenerator');
const fs = require('fs');

// Línea de detalle a buscar (proporcionada por el usuario)
const lineaBuscada = 'DCUIT30715312405    30715312405       PC                                                             00202510201583263702099N00000000664980003041012020251110000000006649800007N                          07T.AUTOSERV.C/R000000000                                                                        .';

// Mapeo teórico de campos según especificación Galicia
const campos = [
  { nombre: 'Código registro', ini: 0, fin: 1 },
  { nombre: 'Tipo identificación cliente', ini: 1, fin: 5 },
  { nombre: 'Identificación cliente', ini: 5, fin: 20 },
  { nombre: 'CUIT/CUIL', ini: 20, fin: 38 },
  { nombre: 'Tipo documento', ini: 38, fin: 40 },
  { nombre: 'Identificación documento', ini: 40, fin: 65 },
  { nombre: 'Identificación interna', ini: 65, fin: 95 },
  { nombre: 'División', ini: 95, fin: 101 },
  { nombre: 'Código moneda', ini: 101, fin: 103 },
  { nombre: 'Fecha de pago', ini: 103, fin: 111 },
  { nombre: 'Sucursal de pago', ini: 111, fin: 114 },
  { nombre: 'Forma de pago', ini: 114, fin: 115 },
  { nombre: 'Identificación del pago', ini: 115, fin: 124 },
  { nombre: 'Marca pago parcial', ini: 124, fin: 125 },
  { nombre: 'Importe de pago', ini: 125, fin: 140 },
  { nombre: 'Nº de cheque', ini: 140, fin: 149 },
  { nombre: 'Fecha acreditación cheque', ini: 149, fin: 157 },
  { nombre: 'Importe del cheque', ini: 157, fin: 172 },
  { nombre: 'Código banco', ini: 172, fin: 175 },
  { nombre: 'Marca pago informado', ini: 175, fin: 176 },
  { nombre: 'Marca pago anulado', ini: 176, fin: 177 },
  { nombre: 'Nº documento de pago', ini: 177, fin: 202 },
  { nombre: 'Tipo canal', ini: 202, fin: 204 },
  { nombre: 'Descripción canal', ini: 204, fin: 218 },
  { nombre: 'Nº boleta CASH', ini: 218, fin: 227 },
  { nombre: 'Filler', ini: 227, fin: 299 },
  { nombre: 'Fin de línea', ini: 299, fin: 300 },
];

// Leer archivo de rendición de pagos
const filePath = '../../DEVINTEGRADA21102025.txt';
const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

// Buscar la línea exacta
const lineaReal = lines.find(l => l === lineaBuscada);
if (!lineaReal) {
  console.error('No se encontró la línea buscada en el archivo.');
  process.exit(1);
}

// Generar datos teóricos desde la línea real
const datosTeoricos = {
  tipoIdentificacion: lineaReal.slice(1, 5).trim(),
  identificacionCliente: lineaReal.slice(5, 20).trim(),
  cuit: lineaReal.slice(20, 38).trim(),
  tipoDocumento: lineaReal.slice(38, 40).trim(),
  idDocumento: lineaReal.slice(40, 65).trim(),
  idInterna: lineaReal.slice(65, 95).trim(),
  division: lineaReal.slice(95, 101).trim(),
  codMoneda: lineaReal.slice(101, 103).trim(),
  fechaPago: lineaReal.slice(103, 111).trim(),
  sucursalPago: lineaReal.slice(111, 114).trim(),
  formaPago: lineaReal.slice(114, 115).trim(),
  idPago: lineaReal.slice(115, 124).trim(),
  pagoParcial: lineaReal.slice(124, 125).trim(),
  importePago: lineaReal.slice(125, 140).trim(),
  nroCheque: lineaReal.slice(140, 149).trim(),
  fechaAcred: lineaReal.slice(149, 157).trim(),
  importeCheque: lineaReal.slice(157, 172).trim(),
  codBanco: lineaReal.slice(172, 175).trim(),
  marcaInformado: lineaReal.slice(175, 176).trim(),
  marcaAnulado: lineaReal.slice(176, 177).trim(),
  docPago: lineaReal.slice(177, 202).trim(),
  tipoCanal: lineaReal.slice(202, 204).trim(),
  descCanal: lineaReal.slice(204, 218).trim(),
  boletaCash: lineaReal.slice(218, 227).trim(),
};

const lineaTeorica = buildRendicionDetalle(datosTeoricos);

console.log('Comparación campo por campo:');
campos.forEach((campo, idx) => {
  const real = lineaReal.slice(campo.ini, campo.fin);
  const teorica = lineaTeorica.slice(campo.ini, campo.fin);
  const igual = real === teorica ? '✔' : '✗';
  console.log(
    `${igual} [${campo.nombre}] (${campo.ini + 1}-${campo.fin}):\n  Real:    '${real}'\n  Teórica: '${teorica}'\n`
  );
});

console.log('¿Líneas completas iguales?:', lineaReal === lineaTeorica ? 'SI' : 'NO');
