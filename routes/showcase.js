var layoutService=require('../lib/homepage'),
photosService=require('../lib/photos');


exports.list = function(req, res){
    layoutService.listFoto(function(data){
        photosService.findDetail(data,function(d){
            res.render('home', { title: 'CyanRhino',data:d, layout:data,user: req.user });
            console.log(d);
        });
    });
};

exports.detail = function(req, res){
    photosService.show(req,res,function(d){
        res.render('detail', { title: 'CyanRhino' ,data:d, user: req.user});
    });

};
