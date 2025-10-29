// compare_lote_test.js
const fs = require('fs');
const cig = require('./cigGenerator');

// Leer el fragmento de lote proporcionado
const fragment = fs.readFileSync(__dirname + '/test_lote_fragment.txt', 'utf8').split(/\r?\n/).filter(Boolean);

console.log('Fragmento original:');
fragment.forEach((line, idx) => {
  console.log(`Línea ${idx + 1} (${line.length}):`);
  console.log(line);
});

// Generar registro equivalente
const record = {
  tipoIdentificacion: 'CUIT',
  identificacionCliente: '30715312405',
  cuit: '30715312405',
  tipoDocumento: 'PC',
  idDocumento: '',
  idInterna: '',
  division: '',
  codMoneda: '00',
  fechaPago: new Date('2020-10-20'),
  sucursalPago: '099',
  formaPago: '2',
  idPago: '',
  pagoParcial: 'N',
  importePago: 66498.00,
  nroCheque: '3041012020',
  fechaAcred: new Date('2020-11-10'),
  importeCheque: 66498.00,
  codBanco: '007',
  marcaInformado: 'N',
  marcaAnulado: 'N',
  docPago: '',
  tipoCanal: '07',
  descCanal: 'T.AUTOSERV.C/R',
  boletaCash: '000000000'
};

const result = cig.generateRendicionFile([record], {
  numeroConvenio: '0000002489',
  numeroArchivo: 2222
});

console.log('\nGenerado por cigGenerator:');
const generated = result.content.split(/\r?\n/).filter(Boolean);
generated.forEach((line, idx) => {
  console.log(`Línea ${idx + 1} (${line.length}):`);
  console.log(line);
});

// Comparación
console.log('\nComparación línea a línea:');
fragment.forEach((line, idx) => {
  if (generated[idx]) {
    console.log(`Línea ${idx + 1}: ${line === generated[idx] ? 'OK' : 'DIFERENTE'}`);
  } else {
    console.log(`Línea ${idx + 1}: No generada`);
  }
});
