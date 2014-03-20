var ids = {
	facebook: {
		clientID: '1429129994000792',
		clientSecret: '0a94d2c1d7066d1e69751c789929254d',
		callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
	},
	twitter: {
		consumerKey: 'YTTnrqTOisyhRbcbCxQuQ',
		consumerSecret: 'Ci1DpCkrmnAPe2cJjZj4Xa29HBxboMEV3aVZccqto',
		callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
	},
	github: {
		clientID: '1e0a0252d3a4a7e350cc',
		clientSecret: 'cfa900388a386b24f2bca9ffbdbe902d793c5790',
		callbackURL: "http://127.0.0.1:3000/auth/github/callback"
	},
	google: {
		returnURL: 'http://127.0.0.1:3000/auth/google/callback',
		realm: 'http://127.0.0.1:3000'
	},
	qq:{
		appKey : "1101256879",
		appSecret : "MKGRSwjK4cz7shRd",
		callbackURL:"http://127.0.0.1:3000/auth/qq/callback"
	}
};
module.exports=exports=ids;