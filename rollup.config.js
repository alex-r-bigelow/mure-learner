import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/Model.js',
  output: {
    file: 'build/mure-learner.js',
    format: 'iife',
    name: 'MureModel',
    globals: {
      d3: 'd3',
      mure: 'mure'
    }
  },
  external: [
    'd3',
    'mure'
  ],
  plugins: [
    resolve({
      module: true,
      jsnext: true
    })
  ]
};
