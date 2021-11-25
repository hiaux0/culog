module.exports = function (wallaby) {
  return {
    debug: true,
    files: [
      'src/**/*.ts'
    ],

    tests: [
      'test/**/*.spec.ts'
    ],

    env: {
      type: 'browser',
      kind: 'chrome',

      // runner: '...',

      // params: {
      //   runner: '...',
      //   env: '...'
      // }
    },

    // compilers: {
    //   '**/*.ts': wallaby.compilers.typeScript({
    //     module: 'commonjs',
    //   }),
    // },

    setup: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};