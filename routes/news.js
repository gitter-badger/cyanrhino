var newsService=require('../lib/news');

exports.index = function(req, res){
	newsService.list(function(news){
		newsService.listRecommend(function(feature){
		    res.render('news', { title: 'CyanRhino', list:news, feature:feature },function(err,html){
		        res.end(html);
		    });
		});	    
	});
};

exports.showPage=newsService.showPage;