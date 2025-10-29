
const { buildCIGLine } = require('../src/utils/cigGenerator.js').default;
const testData = require('../testdata.json');

const line = buildCIGLine(testData);
console.log(line);
console.log('Longitud:', line.length);
