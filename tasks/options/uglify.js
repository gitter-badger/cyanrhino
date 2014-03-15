module.exports=exports={
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
        // files: [{
        //     expand: true,
        //     cwd: 'lib',
        //     src: '**/*.js',
        //     dest: 'dist/js'
        // }],
        options: {
            beautify: {
                beautify:false,
                width:80
            }
        }
    }  
};