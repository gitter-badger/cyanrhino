var newsService=require('../lib/news');
var usersService=require('../lib/users');
var photosService=require('../lib/photos');

exports.index= function(req,res) {
    res.render('backend/dashboard',{ user: req.user });
};

exports.layout= function(req,res) {
    res.render('backend/layout',{ user: req.user });
};

exports.getLogin=function(req,res){
    res.render('backend/login',{ user: req.user });
};

exports.postLogin=function(req,res){
    res.redirect('/backend/home');
};

exports.newsList=function(req,res){
	newsService.list(function(data){
	    res.render('backend/news',{ 
			list:data
		});	
	});
};

exports.newsAdd=function(req,res){
    res.render('backend/edit',{ user: req.user });
};

exports.newsEdit=function(req,res){
	newsService.update(req,res,function(news){
	    res.render('backend/edit',{ 
			article:news
		});	
	});
};

exports.newsUpdate=function(req,res){
    newsService.doUpdate(req,res,function(){
		res.redirect('/backend/news/update/'+req.params._id);
    });
};

exports.photoAdd=function(req,res){
    res.render('backend/foto',{ user: req.user });
};

exports.photoGallery=function(req,res){
	photosService.listFoto(function(data){
		console.log(data);
		res.render('backend/gallery',{ data:data,user: req.user });
	});
};

exports.photoUpdate=function(req,res){
    photosService.photoUpdate(req,res);
};

exports.photoRemove=function(req,res,callback){
    photosService.remove(req,res);
};

exports.newsSave=function(req,res){
    newsService.post(req,res,function(){
		res.redirect('/backend/news/list');
    });
};

exports.newsRemove=function(req,res){
    newsService.remove(req,res,function(){
		res.redirect('/backend/news/list');
    });
};

exports.usersList = function(req, res){
	usersService.list(function(data){
	    res.render('backend/users', { list: data }, function(err, html){
	      res.send(html);
	    });
	});
};

exports.usersRemove=function(req,res){
    usersService.remove(req,res,function(){
		res.redirect('/backend/users');
    });
};

exports.usersUpdate=function(req,res){
    usersService.update(req,res,function(){
		res.redirect('/backend/users');
    });
};

exports.statistics= function(req,res) {
    res.render('backend/statistics',{ user: req.user });
};