const gen = require('../src/utils/cigGenerator').default;

const data = require('./debug_generate_data.json');
const expected = require('./debug_expected.json');

const line = gen.generateDetalleDebug(data);
console.log('GENERATED_LEN', line.length);
console.log('EXPECTED_LEN', expected.length);

const max = Math.max(line.length, expected.length);
const diffs = [];
for (let i = 0; i < max; i++) {
  const a = line[i] || ' ';
  const b = expected[i] || ' ';
  if (a !== b) {
    diffs.push(i + 1);
    if (diffs.length <= 20) {
      console.log(`pos ${i + 1}: got [${a}] expected [${b}]`);
    }
    if (diffs.length === 21) {
      console.log('...más diferencias ocultas...');
    }
    if (diffs.length > 50) {
      console.log('Demasiadas diferencias, abortando comparación.');
      break;
    }
  }
}
console.log('DIFF_COUNT', diffs.length);
