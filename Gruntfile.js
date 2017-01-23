var remapify = require('remapify');
var path = require('path');

module.exports = function (grunt) {
  var copyToExternalPath = '../../../site/fabric';
  var scriptsPattern = ['patterns/**/*.js', 'components/**/*.js', 'assets/scripts/*.js'];
  var scriptsPatternMain = ['patterns/**/*.main.js', 'components/**/*.main.js', 'assets/scripts/**/*.main.js'];
  var stylesPattern = ['patterns/**/*.scss', 'components/**/*.scss', 'assets/styles/**/*.scss', '!**/*_scsslint_tmp*.scss'];
  var imagesPattern = ['assets/images/**/*'];
  var iconsPattern =  ['assets/icons/**/*'];
  var fontsPattern = ['assets/fonts/**/*'];
  var stylesPatternMain = ['./assets/styles/build.scss'];
  var fontsPatternDist = ['./dist/fonts/**/*'];
  var stylesPatternDist = ['./dist/styles/build.css'];
  var scriptsPatternDist = ['./dist/scripts/build.js'];
  var scriptsLibsPatternDist = ['./dist/scripts/libs/**/*.js'];
  var svgPattern = ['assets/icons/svg/*.svg'];

  grunt.config.init({
    watch: {
      options: {
        cwd: './',
        interval: 200,
        spawn: false
      },
      scripts: {
        files: scriptsPattern,
        tasks: ['scripts']
      },
      styles: {
        files: stylesPattern,
        tasks: ['styles']
      },
      copyToExternal: {
        files: stylesPatternDist,
        tasks: ['copy:copyToExternal']
      },
      fonts: {
        files: fontsPattern,
        tasks: ['copy:fonts']
      },
      images: {
        files: imagesPattern,
        tasks: ['copy:images']
      },
      icons: {
        files: iconsPattern,
        tasks: ['copy:icons']
      },
      scsslint: {
        files: stylesPattern
      },
      jscs: {
        files: scriptsPattern
      }
    },
    sass: {
      build: {
        files: {
          './dist/styles/build.css': stylesPatternMain
        }
      }
    },
    /*
     Copy files to dist folder
     */
    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: './assets/fonts/',
          src: '**/*',
          dest: './dist/fonts/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: './assets/images/',
          src: '**/*',
          dest: './dist/images/'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: './assets/icons/',
          src: '**/*',
          dest: './dist/icons/'
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: './assets/scripts/libs/',
          src: '**/*',
          dest: './dist/scripts/libs/'
        }]
      },
      copyToExternal: {
        files: [{
          expand: true,
          cwd: './dist/',
          src: '**/*',
          dest: copyToExternalPath
        }]
      }
    },
    /*
     Apply vendor prefixed properties to generated css using 'Can I use' db
     */
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ browsers: ['last 10 versions', 'ie 8', 'ie 9'] })
        ]
      },
      build: {
        src: stylesPatternDist
      }
    },
    /*
     Minify css - keep fonts and build seperate for now
     */
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        expand: true,
        cwd: './dist/',
        src: ['styles/*.css', 'fonts/**/*.css'],
        dest: './dist/',
        ext: '.css'
      }
    },
    /*
     Build JS bundle using requiresJS optimizer
     */
    requirejs: {
      dev: {
        options: {
          optimize: 'none',
          mainConfigFile: 'config/require.config.js',
          name: 'node_modules/almond/almond',
          include: ['assets/scripts/build.main'],
          insertRequire: ['assets/scripts/build.main'],
          out: 'dist/scripts/build.js'
        }
      }
    },
    /*
     Minify JS - only does the build file until a decision is made on browserify/RequireJS
     */
    uglify: {
      dist: {
        files: {
          './dist/scripts/build.js': [scriptsPatternDist]
        }
      }
    },
    /*
     Generate a modernizr build based on requirements
     */
    modernizr: {
      dist: {
        'dest': './dist/scripts/modernizr.custom.js',
        'parseFiles': true,
        'crawl': true,
        'cache': true,
        'files': {
          'src': ['./dist/scripts/build.js', './dist/styles/build.css']
        },
        'enableJSClass': true,
        'customTests': [],
        'tests': [],
        'excludeTests': ['hidden'],
        'options': [
          'setClasses',
          'domPrefixes',
          'mq'
        ],
        'uglify': true
      }
    },
    /*
     Strip media queries and generate ie8 css
     */
    stripmq: {
      options: {
        width: '59.75em',
        type: 'screen'
      },
      all: {
        files: {
          './dist/styles/ie8.css': ['./dist/styles/build.css']
        }
      }
    },
    /*
     Generate us some svg icons
     */
    svgstore: {
      options: {
        prefix: 'icon-',
        cleanup: true,
        cleanupdefs: true,
        includeTitleElement: false,
        svg: {
          viewBox: '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        formatting: {
          indent_size: 2
        }
      },
      your_target: {
        files: {
          'assets/icons/svg/dist/defs.svg': [svgPattern]
        }
      }
    },
    /*
     * JSCS Linting - for definition's see config and http://jscs.info/rules
     */
    jscs: {
      src: '{components,patterns}/**/assets/scripts/**.main.js',
      options: {
        config: 'config/.jscsrc',
        fix: false,
        force: true
      }
    },
    /*
     Quality check for SCSS
     */
    scsslint: {
      allFiles: [
        '{components,patterns}/**/assets/styles/*.scss',
        'assets/styles/**/*.scss',
        '!assets/styles/{vendor,mixins}/*.scss'
      ],
      options: {
        bundleExec: false,
        config: 'config/.scss-lint.yml',
        reporterOutput: null,
        colorizeOutput: true,
        compact: true,
        force: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('styles', [], function () {
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.task.run('sass', 'postcss:build');
  });

  grunt.registerTask('modernizr', [], function () {
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.task.run('modernizr');
  });

  grunt.registerTask('scripts', [], function () {
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.task.run('requirejs');
  });

  grunt.registerTask('dist', [], function () {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.task.run('copy', 'styles', 'cssmin', 'copy:scripts', 'scripts', 'modernizr', 'uglify');
  });

  grunt.registerTask('sheru', [], function () {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.task.run('copy', 'styles', 'cssmin', 'copy:scripts', 'scripts', 'modernizr', 'uglify');
  });

  grunt.registerTask('ie8', [], function () {
    grunt.loadNpmTasks('grunt-stripmq');
    grunt.task.run('stripmq');
  });

  grunt.registerTask('lintjs', [], function () {
    grunt.loadNpmTasks('grunt-jscs');
    grunt.task.run('jscs');
  });

  grunt.registerTask('lintscss', [], function () {
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.task.run('scsslint');
  });

  grunt.registerTask('lint', [], function () {
    grunt.task.run('lintscss', 'lintjs');
  });

  grunt.registerTask('svg', [], function () {
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.task.run('svgstore');
  });

  grunt.registerTask('default', [], function () {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.task.run('styles', 'cssmin', 'scripts', 'modernizr', 'copy', 'watch');
  });

  /*
   * With SCSS/JSCS linting enabled, we want to only check the currently changed file/s
   */
  var changed_files = Object.create(null);
  var onChange = grunt.util._.debounce(function (ext) {
    if (ext === '.scss') {
      grunt.loadNpmTasks('grunt-scss-lint');
      grunt.config('scsslint.allFiles', Object.keys(changed_files));
      grunt.task.run('scsslint');
    }

    if (ext === '.js') {
      grunt.loadNpmTasks('grunt-jscs');
      grunt.config('jscs.src', Object.keys(changed_files));
      grunt.task.run('jscs');
    }

    changed_files = Object.create(null);
  }, 200);

  grunt.event.on('watch', function ( action, filepath ) {
    var ext = path.extname(filepath);
    changed_files[filepath] = action;
    onChange(ext);
  });
};

/*
 set up aliases used in build process
 */
function preBrowserifyBundle(b) {
  b.plugin(remapify, [
    {
      cwd: './assets/scripts/',
      src: '**/*.js',
      expose: 'build'
    },
    {
      cwd: './components/',
      src: '**/*.main.js',
      expose: 'component'
    },
    {
      cwd: './patterns/',
      src: '**/*.main.js',
      expose: 'pattern'
    }
  ]);
}
