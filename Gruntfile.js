'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*_test.js'],
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			},
		},
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +'<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				src: ['lib/cyanrhino.js'],
				dest: 'dist/js/scripts.js',
			},
			extras: {
				src: ['src/main.js', 'src/extras.js'],
				dest: 'dist/js/with_extras.js',
			}
		},
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'Backbone']
				},
				compress: {
					drop_console: true
				},
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			my_target: {
				files: {
					'dist/js/scripts.min.js': ['lib/cyanrhino.js', 'dist/js/scripts.js']
				},
				//files: [{
					//	expand: true,
					//	cwd: 'lib',
					//	src: '**/*.js',
					//	dest: 'dist/js'
					//}],
					options: {
						beautify: {
							beautify:false,
							width:80
						}
					}
				}
			},
			htmlmin: {                                     // Task
				dist: {                                      // Target
					options: {                                 // Target options
						removeComments: true,
						collapseWhitespace: true
					},
					files: {                                   // Dictionary of files
						'dist/index.html': 'index.html',     // 'destination': 'source'
						'dist/contact.html': 'contact.html'
					}
				}
			},
			csslint: {
				strict: {
					options: {
						import: false
					},
					src: ['css/**/*.css']
				},
				lax: {
					options: {
						import: 2
					},
					src: ['dist/css/**/*.css']
				}
			}
		});

		// These plugins provide necessary tasks.
		grunt.loadNpmTasks('grunt-contrib-nodeunit');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-qunit');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-htmlmin');
		grunt.loadNpmTasks('grunt-contrib-csslint');
  
		// Default task.
		grunt.registerTask('test', ['jshint', 'nodeunit']);

	};
