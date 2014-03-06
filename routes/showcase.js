exports.list = function(req, res){
  res.render('home', { title: 'CyanRhino' });
};

exports.detail = function(req, res){
  res.render('detail', { title: 'CyanRhino' });
};