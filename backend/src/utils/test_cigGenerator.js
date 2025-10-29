// test_cigGenerator.js
const cig = require('./cigGenerator');

// Registro de ejemplo
const record = {
  tipoIdentificacion: 'CUIT',
  identificacionCliente: '20123456789',
  cuit: '20123456789',
  tipoDocumento: 'FC',
  idDocumento: 'A123456789',
  idInterna: 'INT123456789',
  division: 'DIV01',
  codMoneda: '00',
  fechaPago: new Date(),
  sucursalPago: '101',
  formaPago: '2',
  idPago: 'TICKET123',
  pagoParcial: 'N',
  importePago: 12345.67,
  nroCheque: '123456789',
  fechaAcred: new Date(),
  importeCheque: 12345.67,
  codBanco: '007',
  marcaInformado: 'N',
  marcaAnulado: 'N',
  docPago: 'DOC123456789',
  tipoCanal: '07',
  descCanal: 'T.AUTOSERV.C/R',
  boletaCash: '000000001'
};

try {
  // Prueba de generación de archivo completo
  const result = cig.generateRendicionFile([record], {
    numeroConvenio: '0000002489',
    numeroArchivo: 1
  });

  console.log('Archivo generado correctamente.');
  console.log('Contenido:\n');
  console.log(result.content);
  console.log('\nTotal de líneas:', result.totalLines);
  console.log('Total de registros:', result.totalRecords);
  console.log('Total cobrado:', result.totalCobrado);
  console.log('Validado:', result.validado);
} catch (err) {
  console.error('Error al generar archivo:', err.message);
}
