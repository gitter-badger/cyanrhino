var db=require('./dbengine.js');


var newsSchema = new db.Schema({
	title:  String,
	postdate: {type: Date, default: Date.now},
	author: {type: String, default: 'noreplyliz'},
	content: String,
	category:{type:String, default:'news'},
	isRecommend:{type:Boolean, default:false}
});
 
var Model = db.mongoose.model('News', newsSchema);
exports.Model=Model;

exports.post = function(req, res,callback) {	
	new Model({title: req.body.title, author: req.user.username,content: req.body.content,category:req.body.category,isRecommend:req.body.isRecommend }).save(function(err, todo, count){
		if(!err && callback) { callback();}
		else {throw err;}
	});
};
 
exports.list = function(callback) {
	Model.find({}).where('category').ne('career').sort('-postdate').exec(function(err, docs) {
		if (!err){ 
			if(callback) {callback(docs);}
		}
		else { throw err;}
	});
};

exports.listRecommend = function(callback) {
	Model.find({}).where('isRecommend').equals(true).sort('-postdate').exec(function(err, docs) {
		if (!err){ 
			if(callback) {callback(docs);}
		}
		else { throw err;}
	});
};

exports.update = function(req,res,callback) {
	Model.findOne({_id: req.params._id},function(err, doc) {
		if (!err){ 
			if(callback) {callback(doc);}
		}
		else { throw err;}
	});
};

exports.doUpdate=function(req,res,callback){
	Model.update({ _id: req.params._id }, { $set: { title: req.body.title,content:req.body.content, author:req.user.username,category:req.body.category,isRecommend:req.body.isRecommend }},
	function (err) {
		if (!err){ 
			if(callback) {callback();}
		}
		else { throw err;}
	});
};
 
exports.show = (function(req, res) {
	Model.findOne({_id: req.params._id}, function(error, news) {
		res.send([news]);
	});
})();

exports.showPage = function(req,res){
	Model
	.find({ category: req.params.category })
	// .where('name.last').equals('Ghost')
	// .where('age').gt(17).lt(66)
	// .where('likes').in(['vaporizing', 'talking'])
	.sort('-_id')
	.limit(1)
	// .select('name occupation')
	.exec(function(err,article){
		if(err) {res.send(500,err);}
		res.send(article);
	});	
};

exports.remove=function(req,res,callback){
	Model.remove({ _id: req.params._id }, function (err) {
		if (!err){ 
			if(callback) {callback();}
		}
		else { throw err;}
	});
};