module.exports = exports = {
    strict: {
        options: {
            'import': false
        },
        src: ['public/css/**/*.css']
    },
    lax: {
        options: {
            'import': 2
        },
        src: ['dist/css/**/*.css']
    }
};