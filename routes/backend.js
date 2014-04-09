var newsService=require('../lib/news');
var usersService=require('../lib/users');

exports.index= function(req,res) {
    res.render('backend/dashboard',{ user: req.user });
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

exports.photoAdd=function(req,res){
    res.render('backend/foto',{ user: req.user });
};

exports.photoGallery=function(req,res){
    res.render('backend/gallery',{ user: req.user });
};

exports.newsSave=function(req,res){
    res.send(newsService.post(req,res));
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

exports.statistics= function(req,res) {
    res.render('backend/statistics',{ user: req.user });
};