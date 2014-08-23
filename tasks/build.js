module.exports = exports = function(grunt) {
    grunt.registerTask('build', ['jshint','nodeunit','concat', 'uglify', 'htmlmin']);
};
