var db=require('./dbengine.js');


var newsSchema = new db.Schema({
	title:  String,
	postdate: {type: Date, default: Date.now},
	author: {type: String, default: 'noreplyliz'},
	content: String
});
 
var Model = db.mongoose.model('News', newsSchema);
exports.Model=Model;

exports.post = function(req, res) {
	new Model({title: req.body.title, author: req.user.username,content: req.body.content }).save(function(err, todo, count){
		return 200;
	});
};
 
exports.list = function(callback) {
	Model.find({},function(err, docs) {
		if (!err){ 
			if(callback) callback(docs);
		}
		else { throw err;}
	});
};
 
exports.show = (function(req, res) {
	Model.findOne({_id: req.params._id}, function(error, news) {
		res.send([news]);
	});
});

exports.remove=function(req,res,callback){
	Model.remove({ _id: req.params._id }, function (err) {
		if (!err){ 
			if(callback) callback();
		}
		else { throw err;}
	});
};