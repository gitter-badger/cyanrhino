var newsService=require('../lib/news');

exports.index = function(req, res){
	newsService.list(function(news){
	    res.render('news', { title: 'CyanRhino', list:news },function(err,html){
	        res.end(html);
	    });
	})
};