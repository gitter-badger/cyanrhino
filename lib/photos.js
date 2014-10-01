var db=require('./dbengine.js'),
fs = require('fs'),
os=require('os');

console.log(os.type());
var SYSTEM_DELIMITER=os.type().indexOf('Windows')!=-1?'\\':'/';

// exports.listFoto=function(cb){
// 	fs.readdir("./uploads", function (err, files) {
// 		var count = files.length,
// 		results =new Array() ;
// 		files.forEach(function (filename) {
// 			fs.readFile(filename, function (data) {
// 				var tmpResult={};
//
// 				var rFilter = /(jpeg|png|gif|bmp|jpg|tiff)$/i;
// 				if (rFilter.test(filename)) {
// 					tmpResult["imageName"]=filename;
// 					tmpResult["imagePath"] = "/thumb/"+filename+'/full_128_'+filename;
// 					results.push(tmpResult);
// 				}
// 				count--;
// 				if (count == 0) {
// 					//console.log(results);
// 					if(cb) cb(results);
// 				}
// 			});
// 		});
//
// 	});
// };

exports.listFoto=function(cb){
	Model.find({}).sort('-uploadDate').exec(function(err, files) {
		if (!err){
			var count = files.length,
			results =new Array() ;

			if(0==count){
        		if(cb) cb(results);
			}

			files.forEach(function (file) {
				var tmpResult={};

				var rFilter = /(jpeg|png|gif|bmp|jpg|tiff)$/i;
				if (rFilter.test(file.path)) {
					tmpResult["_id"]=file._id;
					tmpResult["tag"]=file.tag;
					var filename=file.path.slice(file.path.lastIndexOf(SYSTEM_DELIMITER)+1,file.path.length);
					tmpResult["imagePath"] = SYSTEM_DELIMITER+"thumb"+SYSTEM_DELIMITER+filename+SYSTEM_DELIMITER+'full_128_'+filename;
					tmpResult['title']=file.title;
					tmpResult['content']=file.content;
					//tmpResult['layout']=file.layout;
					results.push(tmpResult);
				}
				count--;
				if (count == 0) {
					//console.log(results);
					if(cb) cb(results);
				}
			});
		}
		else { throw err;}
	});
};

var photoSchema = new db.Schema({
	title:  String,
	uploadDate: {type: Date, default: Date.now},
	content: String,
	tag: String,
	path:String,
	filename:{type: String, default: ''},
	//layout:{type: Number, default: 0},
	isCover:{type: Boolean, default: false},
	coverRoute:String
});

var Model = db.mongoose.model('Photo', photoSchema);

exports.Model=Model;

// var layoutEnum = ['full','mid','onethird','twothirds'];
// photoSchema.methods.getLayout = function () {
//   return layoutEnum[this.layout];
// }

exports.post = function(req, res,callback) {
	Model.create({
		title:req.body.title,
		content:req.body.content,
		tag:req.body.tag,
		//layout:req.body.layout
	}, function (err, photo, count) {
		if(!err && callback) callback();
		else throw err;
	});
};

exports.save = function(photo,callback) {
	Model.remove({ path:photo.path }, function (err) {
		if (!err){
			new Model({
				title:photo.title,
				content:photo.content,
				tag:photo.tag,
				path:photo.path,
				filename:photo.path.slice(photo.path.lastIndexOf(SYSTEM_DELIMITER)+1,photo.path.length)
			}).save(function (err, photo, count) {
				if(!err && callback) callback();
			});
		}
	});
};

exports.listTags = function(callback) {
	//db.photos.find({'tag':{'$exists':true,'$ne':''}})
};

exports.show = function(req, res,callback) {
   Model.findOne({ $or: [{ filename: req.param('uuid') }, { _id: db.mongoose.Types.ObjectId(req.param('uuid')) }] }, function (err, detail) {
		if(!err) {
			if(callback) {
				callback(detail);
			}
		}
		else {
			if(callback) {
				callback(err);
			}
		}
	});
};

exports.findDetail = function(data,cb) {
	var e=[];
	if(data.length<=0 && cb) {cb();}
	data.forEach(function(d){
		Model.findOne({filename:d.filename},function(err,detail){
			e.push(detail);
			if(e.length>=data.length && cb) cb(e);
		});
	});
};

exports.showCover = (function(req, res,callback) {
	Model.findOne({coverRoute:req.params.route}, function(error, photo) {
		if(error) res.send(500);
	})
	.where('isCover')
	.equals(true)
	.exec(callback);
});

exports.remove=function(req,res,callback){
	Model.remove({ _id: req.params._id }, function (err) {
		if (!err){
			if(callback) callback();
			else res.send(200);
		}
		else { throw err;}
	});
};

exports.photoUpdate = function(req,res,callback){
Model.update({ _id: req.params._id }, { $set: { title: req.body.caption,content:req.body.summary, tag:req.body.tag/*,layout:req.body.layout*/ }},
	function (err) {
		if (!err){
			if(callback) callback();
			else res.send(200);
		}
		else { throw err;}
	});
};
