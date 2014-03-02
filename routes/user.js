exports.list = function(req, res){
    res.render('user', { name: 'Tobi' }, function(err, html){
      console.log(html);
      console.log(err);
    });
};