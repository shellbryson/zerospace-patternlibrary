require.config({
  'baseUrl': '../',
  'paths': {
    //  path aliases
    'build': 'assets/scripts',

    //  client libs
    'jquery':               'assets/scripts/jquery',
    'modernizr':            'assets/scripts/libs/modernizr/modernizr',
    'toggleAttribute':      'assets/scripts/toggleattribute',

    //  components

  },
  shim: {
    'modernizr': {
      exports: 'Modernizr'
    }
  }
});
