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

// Export user model
var Model = db.mongoose.model('User', userSchema);
exports.Model = Model;
