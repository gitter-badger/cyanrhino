module.exports=exports={
    dist: {                                      // Target
        options: {                                 // Target options
            removeComments: true,
            collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
            'dist/index.html': 'public/index.html',     // 'destination': 'source'
            'dist/home.html': 'public/home.html'
        }
    }
};