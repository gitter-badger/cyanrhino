var layoutService=require('../lib/homepage'),
photosService=require('../lib/photos'),
albumService=require('../lib/album');


exports.list = function(req, res){
    layoutService.listFoto(function(data){
        photosService.findDetail(data,function(d){
            res.render('home', { title: 'CyanRhino',data:d, layout:data,user: req.user });
            console.log(d);
        });
    });
};

exports.detail = function(req, res){
	albumService.show(req,res, function(a){
        if(a.length==0){
            photosService.show(req,res,function(d){
                res.render('detail', { title: 'CyanRhino' ,data:d, user: req.user});
            });
        } else{
            var tmp=[], albumFoto=a;

            photosService.findDetail(a,function(d){
                res.render('detail', { title: 'CyanRhino' ,data:d, user: req.user});

            });

        }
    });


};
