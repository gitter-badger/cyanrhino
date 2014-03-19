exports.list = function(req, res){
    res.render('backend/users', { name: 'Tobi' }, function(err, html){
      res.send(html);
      console.log(err);
    });
};