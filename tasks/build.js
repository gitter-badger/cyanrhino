module.exports = exports = function(grunt) {
    grunt.registerTask('build', ['jshint','concat', 'uglify', 'htmlmin']);
};
