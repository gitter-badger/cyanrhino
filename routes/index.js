exports.index = function(req, res){
  res.render('index', { title: 'CyanRhino' });
};

exports.career = function(req, res){
  res.render('career', { title: 'CyanRhino' });
};

exports.contact= function(req, res){
  res.render('contact', { title: 'CyanRhino' });
};
