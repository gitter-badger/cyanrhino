var db=require('./dbengine.js');


var newsSchema = new db.Schema({
	title:  String,
	postdate: {type: Date, default: Date.now},
	author: {type: String, default: 'noreplyliz'},
	content: String
});
 
var Model = db.mongoose.model('News', newsSchema);
exports.Model=Model;

exports.post = function(req, res,callback) {
	new Model({title: req.body.title, author: req.user.username,content: req.body.content }).save(function(err, todo, count){
		if(!err && callback) callback();
		else throw err;
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

exports.update = function(req,res,callback) {
	Model.findOne({_id: req.params._id},function(err, doc) {
		if (!err){ 
			if(callback) callback(doc);
		}
		else { throw err;}
	});
};

exports.doUpdate=function(req,res,callback){
	Model.update({ _id: req.params._id }, { $set: { title: req.body.title,content:req.body.content, author:req.user.username }},
	function (err) {
		if (!err){ 
			if(callback) callback();
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