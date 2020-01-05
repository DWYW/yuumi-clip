const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

exports.rollup = function () {
  return rollup.rollup({
    input: process.env.ROLLUP_INPUT_FILE,
    plugins: [
      rollupTypescript()
    ]
  }).then(bundle => {
    return bundle.write({
      file: `${process.env.OUTPUT_DIR}/${process.env.ROLLUP_OUTPUT_FILE}`,
      format: process.env.ROLLUP_FORMAT,
      name: process.env.ROLLUP_NAME,
      sourcemap: process.env.ROLLUP_SOURCE_MAP === 'ok'
    });
  });
}