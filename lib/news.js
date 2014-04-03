var db=require('./dbengine.js');


var newsSchema = new Schema({
	title:  String,
	postdate: {type: Date, default: Date.now},
	author: {type: String, default: 'noreplyliz'},
	content: String
});
 
var Model = mongoose.model('News', newsSchema);
exports.Model=Model;

exports.post = function(req, res) {
	new Model({title: req.body.title, author: req.body.author,content: req.body.content }).save(function(err, todo, count){
		res.redirect( '/backend/news' );
	});
}
 
exports.list = function(req, res) {
	Model.find(function(err, news) {
		res.send(news);
	});
}
 
exports.show = (function(req, res) {
	Model.findOne({_id: req.params.id}, function(error, news) {
		res.send([news]);
	});
})
});