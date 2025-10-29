// test_rendicion_archivo_10ejemplos.js
const { buildRendicionDetalle } = require('./cigGenerator');
const fs = require('fs');

const filePath = '../../DEVINTEGRADA21102025.txt';
const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

// Filtrar solo líneas de detalle (empiezan con 'D')
const detalles = lines.filter(l => l.startsWith('D')).slice(0, 10);

const generadas = detalles.map(lineaReal => {
  // Extraer campos según mapeo teórico
  return buildRendicionDetalle({
    tipoIdentificacion: lineaReal.slice(1, 5).trim(),
    identificacionCliente: lineaReal.slice(5, 20).trim(),
    cuit: lineaReal.slice(20, 31).trim(),
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
  });
});

// Comparar cada línea generada con la real
let todasIguales = true;
detalles.forEach((real, idx) => {
  const teorica = generadas[idx];
  if (real !== teorica) {
    todasIguales = false;
    console.log(`\n✗ Diferencia en línea ${idx + 1}:`);
    for (let i = 0; i < 300; i++) {
      if (real[i] !== teorica[i]) {
        console.log(`Pos ${i + 1}: real='${real[i]}' teorica='${teorica[i]}'`);
      }
    }
  } else {
    console.log(`\n✔ Línea ${idx + 1} OK`);
  }
});

console.log('\n¿Todas las líneas son iguales?:', todasIguales ? 'SI' : 'NO');
