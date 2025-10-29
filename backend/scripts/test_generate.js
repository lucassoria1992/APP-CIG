const gen = require('../src/utils/cigGenerator').default;

const data = {
  cliente: 'Test',
  tipoIdentificacion: 'CUIT',
  identificacionCliente: '30715312405',
  cuit: '30715312405',
  tipoDocumento: 'PC',
  idDocumento: '',
  idInterna: '',
  division: '',
  codMoneda: '00',
  fechaPago: '2025-10-20',
  sucursalPago: '101',
  formaPago: '2',
  idPago: '',
  pagoParcial: 'N',
  importePago: 66498,
  nroCheque: '3041012',
  fechaAcred: '2025-11-10',
  importeCheque: 66498,
  codBanco: '007',
  marcaInformado: 'N',
  marcaAnulado: 'N',
  docPago: '',
  tipoCanal: '07',
  descCanal: 'T.AUTOSERV.C/R',
  boletaCash: '000000000',
  observaciones: ''
};

const expected = 'DCUIT30715312405    30715312405       PC                                                             00202510201583263702099N00000000664980003041012020251110000000006649800007N                          07T.AUTOSERV.C/R000000000                                                                        .';

try {
  const line = gen.generateDetalle(data);
  console.log('GENERATED_LEN:', line.length);
  console.log('GENERATED:');
  console.log(line);
  console.log('\nEXPECTED_LEN:', expected.length);
  console.log('EXPECTED:');
  console.log(expected);

  const max = Math.max(line.length, expected.length);
  const diffs = [];
  for (let i = 0; i < max; i++) {
    const a = line[i] || ' ';
    const b = expected[i] || ' ';
    if (a !== b) {
      diffs.push(i + 1);
      if (diffs.length <= 30) {
        console.log(`pos ${i + 1}: got [${a}] expected [${b}]`);
      }
    }
  }

  if (diffs.length === 0) {
    console.log('\nRESULT: IDENTICAL');
  } else {
    console.log('\nRESULT: DIFF_COUNT =', diffs.length);
    console.log('First diff positions (up to 30 shown):', diffs.slice(0, 30).join(', '));
  }
} catch (err) {
  console.error('ERROR during generation:', err.message);
}
