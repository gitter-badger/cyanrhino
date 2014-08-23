var backend=require('../routes/backend');
var news=require('./news');
var passport=require('passport');
var auth = require('./authentication.js');
var upload=require('./upload.js');

module.exports = exports = function(app){
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/backend/login');
	}

	// Check for admin middleware
	function ensureAdmin(req, res, next) {
		console.log(req.user);
		if(req.user && req.user.is_admin === true) { next(); }
		else { res.send(403); }
	}





	app.get('/backend',function(req,res){
		res.redirect('/backend/login');
	});
	app.get('/backend/home',ensureAuthenticated,backend.index);
	app.get('/backend/statistics',ensureAuthenticated,ensureAdmin,backend.statistics);
	app.get('/backend/gallery/add',ensureAuthenticated,backend.photoAdd);
	app.get('/backend/gallery',ensureAuthenticated,backend.photoGallery);
	app.get('/backend/users',ensureAuthenticated,ensureAdmin, backend.usersList);
	app.post('/backend/users',ensureAuthenticated,ensureAdmin, backend.usersUpdate);
	app.get('/backend/users/remove/:_id',ensureAuthenticated, ensureAdmin, backend.usersRemove);
	app.get('/backend/news/list',ensureAuthenticated, backend.newsList);
	app.get('/backend/news/add',ensureAuthenticated, backend.newsAdd);
	app.get('/backend/news/update/:_id',ensureAuthenticated, backend.newsEdit);
	app.post('/backend/news/update/:_id',ensureAuthenticated, backend.newsUpdate);
	app.post('/backend/news/add',ensureAuthenticated, backend.newsSave);
	app.get('/backend/news/remove/:_id',ensureAuthenticated, backend.newsRemove);
	app.get('/backend/layout',ensureAuthenticated, backend.layout);
	app.get('/backend/login',backend.getLogin);
	app.post('/backend/upload',ensureAuthenticated, upload.legacyUpload);
	app.post('/backend/gallery/update/:_id',ensureAuthenticated, backend.photoUpdate);
	app.get('/backend/gallery/remove/:_id',ensureAuthenticated, ensureAdmin, backend.photoRemove);
	app.post('/backend/layout/save',ensureAuthenticated, ensureAdmin, backend.layoutSave);

	// app.post('/backend/login',passport.authenticate('weibo', { failureRedirect: '/backend/login',successRedirect: '/backend/home' }),backend.postLogin);

	app.post('/backend/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				req.session.messages =  [info.message];
				return res.redirect('/backend/login');
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/backend/home');
			});
		})(req, res, next);
	});

	app.get('/backend/logout', function(req, res){
		req.logout();
		res.redirect('/backend/login');
	});
	//console.log(app.routes);
	app.get('/auth/weibo',passport.authenticate('weibo'),function(){});

	app.get('/auth/weibo/callback', passport.authenticate('weibo', { failureRedirect: '/backend/login' }), function(req, res) {
		res.redirect('/backend/home');
	});




	app.get('/auth/qq', passport.authenticate('qq'), function(){});

	app.get('/auth/qq/callback', passport.authenticate('qq', { failureRedirect: '/backend/login' }),function(req, res) {
		res.redirect('/backend/home');
	});


	app.get('/auth/facebook',
	passport.authenticate('facebook'),
	function(req, res){
	});
	app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/backend/login'  }),
	function(req, res) {
		res.redirect('/backend/home');
	});
	app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){
	});
	app.get('/auth/twitter/callback',
	passport.authenticate('twitter', { failureRedirect: '/backend/login'  }),
	function(req, res) {
		res.redirect('/backend/home');
	});
	app.get('/auth/github',
	passport.authenticate('github'),
	function(req, res){
	});
	app.get('/auth/github/callback',
	passport.authenticate('github', { failureRedirect: '/backend/login'  }),
	function(req, res) {
		res.redirect('/backend/home');
	});
	app.get('/auth/google',
	passport.authenticate('google'),
	function(req, res){
	});
	app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/backend/login'  }),
	function(req, res) {
		res.redirect('/backend/home');
	});

};
