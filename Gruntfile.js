
module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.initConfig({

    requirejs: {
      options: {
        baseUrl: 'js',
        mainConfigFile: 'js/requirejs_config.js',
        compress: 'uglify2',
        preserveLicenseComments: false,
        removeCombined: true
      },
      main: {
        options: {
          name: 'app',
          out: '.tmp/app.js'
        }
      }
    }

  });

  grunt.registerTask('optimize', function(){
    // this modules should already be included on app.js
    var modulesToExclude = ['jquery', 'underscore'];

    // scan the js/renderers folder
    var rendererNames = grunt.file.expand({cwd: 'js/renderers'}, '**/*.js');

    // add a requirejs task for each renderer
    rendererNames.map(function(rendererName){
      var rendererName = rendererName.replace('.js', '');

      grunt.config('requirejs.' + rendererName, {
        options: {
          name: 'renderers/' + rendererName,
          out: '.tmp/renderers/' + rendererName + '.js',
          exclude: modulesToExclude
        }
      });
    });

    grunt.task.run(['requirejs']);
  });
};