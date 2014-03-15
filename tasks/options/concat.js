module.exports=exports={
    options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +'<%= grunt.template.today("yyyy-mm-dd") %> */',
    },
    dist: {
        src: ['lib/cyanrhino.js'],
        dest: 'dist/js/scripts.js',
    },
    extras: {
        src: ['public/js/main.js', 'public/js/extras.js'],
        dest: 'dist/js/with_extras.js',
    }
};