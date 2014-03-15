'use strict';
var glob=require('glob');
var path = require('path');
var join = path.join;
module.exports = function(grunt) {
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration.
    var config={
        pkg: grunt.file.readJSON('package.json')
    };
    grunt.util._.extend(config, loadConfig('./tasks/options/'));
    grunt.initConfig(config);
    
  
    // Default task.
    grunt.loadTasks('tasks');
};


function loadConfig(configPath) {
    var config = {};

    glob.sync('*', { cwd: configPath })
    .forEach(function(configFile) {
        var prop = configFile.replace(/\.js$/, '');
        config[prop] = require(join(__dirname, configPath, configFile));
    });

    return config;
}