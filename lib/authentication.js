var config = require('./oauth.js');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var WeiboStrategy=require('passport-weibo').Strategy;
var QQStrategy = require('passport-qq').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

var Users=require('./users.js');

var users = [
{ id: 1, username: 'noreplyliz', password: 'password', email: 'noreplyliz@gmail.com' }, 
{ id: 2, username: 'sodafish', password: 'password', email: 'sodafish@gmail.com' },
{ id: 3, username: 'ishida83', password: '123', email: 'joe@example.com' },
{ id: 4, username: '174916', password: '123', email: 'joe@example.com' },
{id:5, username: '113375872', password: '123', email:'z@z.cn'}
];
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
// 
// passport.deserializeUser(function(id, done) {
//   findById(id, function (err, user) {
//     done(err, user);
//   });
// });

/*function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
		fn(new Error('User ' + id + ' does not exist'));
	}
}*/

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
//       findByUsername(username, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//         if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
//         return done(null, user);
//       });
//     });
//   }
// ));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	Users.Model.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	Users.Model.findOne({ username: username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
		if (password!==user.password) { return done(null, false, { message: 'Invalid password' }); }
		return done(null, user);
	});
}));

passport.use(new WeiboStrategy({
    clientID: '3725097287',
    clientSecret: '11f38563839765143e1e4ea524ccae64',
    callbackURL: "http://www.cyanrhino.com/auth/weibo/callback"
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      
        findByUsername(profile.id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user '}); }
            // if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        });
    });
}));


passport.use(new QQStrategy({
	clientID: config.qq.appKey,
	clientSecret: config.qq.appSecret,
	callbackURL: config.qq.callbackURL
},
function(accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
})
);



passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log(profile);
        findByUsername(profile.id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user '}); }
            // if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        });
    });
}
));

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log(profile);
        findByUsername(profile.id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user '}); }
            // if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        });
    });
}
));

passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log(profile);
        findByUsername(profile.id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user '}); }
            // if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        });
    });
}
));

passport.use(new GoogleStrategy({
    returnURL: config.google.returnURL,
    realm: config.google.realm
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log(profile);
        findByUsername(profile.id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user '}); }
            // if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
        });
    });
}
));