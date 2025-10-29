// test_compare_real_vs_teorica.js
const { buildRendicionDetalle } = require('./cigGenerator');

// Línea real extraída del archivo DEVINTEGRADA21102025.txt
const lineaReal =
  'DCUIT30707895825    30707895825       PC                                                             00202510200004263699577N000000004608697                                   N                          12DIGITAL       000000000                                                                        .';

// Datos equivalentes para generar la línea teórica
const datosTeoricos = {
  tipoIdentificacion: 'CUIT',
  identificacionCliente: '30707895825',
  cuit: '30707895825',
  tipoDocumento: 'PC',
  idDocumento: '', // PC: espacios
  idInterna: '00202510200004263699577',
  division: '',
  codMoneda: '00',
  fechaPago: '',
  sucursalPago: '',
  formaPago: '',
  idPago: '000000004608697',
  pagoParcial: 'N',
  importePago: '',
  nroCheque: '',
  fechaAcred: '',
  importeCheque: '',
  codBanco: '',
  marcaInformado: 'N',
  marcaAnulado: '',
  docPago: '',
  tipoCanal: '12',
  descCanal: 'DIGITAL',
  boletaCash: '000000000',
};

const lineaTeorica = buildRendicionDetalle(datosTeoricos);

console.log('Línea real:   ', lineaReal);
console.log('Línea teórica:', lineaTeorica);
console.log('\n¿Son iguales?:', lineaReal === lineaTeorica ? 'SI' : 'NO');

// Mostrar diferencias por posición
for (let i = 0; i < 300; i++) {
  if (lineaReal[i] !== lineaTeorica[i]) {
    console.log(`Posición ${i + 1}: real='${lineaReal[i]}' teorica='${lineaTeorica[i]}'`);
  }
}
