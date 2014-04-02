var mongoose = require('mongoose');
exports.mongoose = mongoose;

// Database connect
var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL || 
'mongodb://localhost/test';
  
var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
	if (err) { 
		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + uristring);
	}
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('Connected to DB');
});

/**
	TODO: Database schema  add more validation
 */
var Schema = mongoose.Schema, 
ObjectId = Schema.ObjectId;

exports.Schema=Schema;
exports.ObjectId=ObjectId;




