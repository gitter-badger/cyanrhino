exports.index= function(req,res) {
    res.render('backend/dashboard',{ user: req.user });
};

exports.getLogin=function(req,res){
    res.render('backend/login',{ user: req.user });
};

exports.postLogin=function(req,res){
    res.redirect('/backend/home');
};