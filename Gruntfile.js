module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssUrlEmbed: {
      encodeDirectly: {
        files: {
          'build/style.css': ['style.css']
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-css-url-embed')

  // Default task(s).
  grunt.registerTask('default', ['cssUrlEmbed'])
};