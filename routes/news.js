exports.index = function(req, res){
  res.render('news', { title: 'CyanRhino' },function(err,html){
      res.end(html);
  });
};