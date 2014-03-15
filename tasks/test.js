module.exports = exports = function(grunt) {
    grunt.registerTask('test', ['jshint', 'nodeunit','watch']);
};