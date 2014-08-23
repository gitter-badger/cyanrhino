var db=require('./dbengine.js');

// User schema
var userSchema = new db.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  is_admin: { type: Boolean, required: true }
});


// Password verification
userSchema.methods.comparePassword = function(candidatePassword, fn) {

};

// Seed a user
var User = db.mongoose.model('User', userSchema);
var usr = new User({ username: 'noreplyliz', email: 'noreplyliz@gmail.com', password: 'password',is_admin:true });
usr.save(function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('user: ' + usr.username + " saved.");
	}
});

usr = new User({ username: 'sylvia', email: 'sylvia@gmail.com', password: 'password',is_admin:false });
usr.save(function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('user: ' + usr.username + " saved.");
	}
});

// Export user model
exports.Model = User;


exports.list = function(callback) {
	User.find({},function(err, docs) {
		if (!err){ 
			if(callback) {callback(docs);}
		}
		else { throw err;}
	});
};

exports.remove=function(req,res,callback){
	User.remove({ _id: req.params._id }, function (err) {
		if (!err){ 
			if(callback) {callback();}
		}
		else { throw err;}
	});
};

exports.update=function(req,res,callback){
	User.update({ _id: req.body._id }, { $set: { email: req.body.email,password:req.body.password, is_admin:req.body.is_admin }},
	function (err) {
		if (!err){ 
			if(callback) {callback();}
		}
		else { throw err;}
	});
	// User.findOneAndUpdate(req.params._id, { name: 'jason borne' }, options, callback);
	// User.findByIdAndUpdate(req.params._id, { $set: { size: 'large' }}, function (err, user) {
	//   if (err) return handleError(err);
	//   res.send(user);
	// });
};