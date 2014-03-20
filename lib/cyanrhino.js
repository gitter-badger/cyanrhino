/*
* cyanrhino
* https://ishida83.github.io/cyanrhino
*
* Copyright (c) 2014 ishida
* Licensed under the GPLv3 license.
*/

'use strict';
process.env.NODE_ENV = 'development';

var express = require('express');
var app = express();
// var http=require('http');
var cluster=require('cluster');
//var https=require('https');
var port = process.env.PORT || 3000;
var engines = require('consolidate');
var passport=require('passport');
var auth = require('./authentication.js');






var routes=require('../routes');
var user=require('../routes/user');
var showcase=require('../routes/showcase');
var news=require('../routes/news');
var backend=require('../routes/backend');










app.configure(function(){
    app.set('title', 'Cyanrhino');
    app.setMaxListeners(1023);
    app.engine('html', require('ejs').renderFile);
    app.engine('html', engines.ejs);

    // set .html as the default extension 
    app.set('view engine', 'html');
    app.set('views', process.cwd() + '/views');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/uploads' }));
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'SECRET' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.enable('trust proxy');
    app.use(app.router);
 
    //app.use(express.static(__dirname + '/public'));
    app.use(express.static(process.cwd() + '/public'));
    app.use('/doc',express.directory(process.cwd() + '/doc',{ icons:true, }));
    app.use('/doc',express.static(process.cwd() + '/doc'));
    // app.use(express.basicAuth(function(user, pass){
    //     return 'admin' == user && 'pass' == pass;
    // }));
 
    app.use(function(err, req, res, next){
        if (req.xhr) {
            console.error(err.stack);
            res.send(500, { error: 'Something blew up!' });
        } else {
            res.status(err.status || 500);
            next(err);
        }
    });
    app.use(function(req, res, next){
        res.status(404);
        if (req.accepts('html')) {
            res.sendfile(process.cwd()+'/public/404.html');
            return;
        }
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }
        res.type('txt').send('Not found');
        next();
    });   
});

app.configure('development', function(){
    app.enable('verbose errors');
    app.set('websokcet local uri', 'localhost');
    // development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    }
    
});

app.configure('production', function(){
    app.disable('verbose errors');
    app.set('websocket uri', '10.74.125.195');
});



var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }, 
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' },
    { id: 3, username: 'ishida83', password: '123', email: 'joe@example.com' },
    { id: 4, username: '174916', password: '123', email: 'joe@example.com' },
    {id:5, username: '113375872', password: '123', email:'z@z.cn'}
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username == username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/backend/login');
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});









app.param(function(name, fn){
    if (fn instanceof RegExp) {
        return function(req, res, next, val){
            var captures;
            if (captures = fn.exec(String(val))) {
                req.params[name] = captures;
                next();
            } else {
                next('route');
            }
        };
    }
});

app.param('id', /^\d+$/);

app.get('/user/:id', function(req, res){
    res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
    res.cookie('rememberme', {items: [1,2,3]}, { maxAge: 900000,expires: new Date(Date.now() + 900000), httpOnly: true });
    res.clearCookie('name', { path: '/admin' });
    //res.send('user ' + req.params.id);
    res.redirect(302, 'back');
});

app.param('range', /^(\w+)\.\.(\w+)?$/);

app.get('/range/:range', function(req, res){
    var range = req.params.range;
    res.set('Content-Type', 'text/plain');
    res.send('from ' + range[1] + ' to ' + range[2]);
    res.send(new Buffer('whoop'));
    res.send({ some: 'json' });
    res.send(404, 'Sorry, we cannot find that!');
    res.json(500, { error: 'message' });
});

app.get('/user/:uid/photos/:file', function(req, res){
    var uid = req.params.uid,
    file = req.params.file;
    //res.attachment('/uploads/' + uid + '/' + file);
    res.sendfile('/uploads/' + uid + '/' + file);
    
    res.download('/report-12345.pdf', 'report.pdf', function(err){
        if (err) {
            // handle error, keep in mind the response may be partially-sent
            // so check res.headerSent
        } else {
            // decrement a download credit etc
        }
    });
});

app.get('/', routes.index);
app.get('/showcase', showcase.list);
app.get('/showcase/:uuid', showcase.detail);
app.get('/career', routes.career);
app.get('/contact', routes.contact);
app.get('/news',news.index);

app.get('/backend',function(req,res){
    res.redirect('/backend/login'); 
});
app.get('/backend/home',ensureAuthenticated,backend.index);
app.get('/backend/users',ensureAuthenticated, user.list);
app.get('/backend/news/list',ensureAuthenticated, backend.newsList);
app.get('/backend/news/add',ensureAuthenticated, backend.newsAdd);
//app.post('/backend/news/add',ensureAuthenticated, backend.newsSave);
app.get('/backend/login',backend.getLogin);
// app.post('/backend/login',passport.authenticate('weibo', { failureRedirect: '/backend/login',successRedirect: '/backend/home' }),backend.postLogin);

app.post('/backend/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/backend/login')
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







    
if (process.getgid && process.setgid) {
    console.log('Current gid: ' + process.getgid());
    try {
        process.setgid(501);
        console.log('New gid: ' + process.getgid());
    }
    catch (err) {
        console.log('Failed to set gid: ' + err);
    }
}
if (process.getuid && process.setuid) {
    console.log('Current uid: ' + process.getuid());
    try {
        process.setuid(501);
        console.log('New uid: ' + process.getuid());
    }
    catch (err) {
        console.log('Failed to set uid: ' + err);
    }
}
process.on('uncaughtException', function (err) {
    console.log(err);
});
process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit();
});
process.on('exit', function(){
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit();
});













// if (cluster.isMaster) {
//     require('os').cpus().forEach(function(){
//         cluster.fork();
//     });
//     var timeouts = [];
//     var errorMsg = function() {
//         console.error("Something must be wrong with the connection ...");
//     };
// 
//     cluster.on('fork', function(worker) {
//         timeouts[worker.id] = setTimeout(errorMsg, 2000);
//     });
//     cluster.on('listening', function(worker, address) {
//         clearTimeout(timeouts[worker.id]);
//         console.log("A worker with #"+worker.id+" is now connected to " + address.address + ":" + address.port); 
//     });
//     cluster.on('exit', function(worker, code, signal) {
//         clearTimeout(timeouts[worker.id]);
//         console.log('worker %d died (%s). restarting...',worker.process.pid, signal || code);
//         cluster.fork();
//     });
//     cluster.on('disconnect', function(worker) {
//         clearTimeout(timeouts[worker.id]);
//         console.log('The worker #' + worker.id + ' has disconnected');
//     });
// 
// } else if (cluster.isWorker) {
//     console.log('I am worker #' + cluster.worker.id);
    app.listen(port);
    //http.createServer(app).listen(port);
    //https.createServer({}, app).listen(443);
    console.log('Listening on port '+port);
// }









