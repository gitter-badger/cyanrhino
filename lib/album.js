var db=require('./dbengine.js'),
fs = require('fs'),
os=require('os');


var SYSTEM_DELIMITER=os.type().indexOf('Windows')!=-1?'\\':'/';

var albumSchema = new db.Schema({
	coverId:String,
	photoPath:{type: String},
	albumTitle:String,
	albumSummary:String
});


var Model = db.mongoose.model('Album', albumSchema);


exports.show=function(req,res,cb){
	if('undefined'!==req.param('uuid')) {
		Model.find({coverId:req.param('uuid')}).exec(function(err, files) {
			if (!err){
				var count = files.length,
				results =new Array() ;

				if(0===count){
					if(cb) {
						cb(results);
					}
				}

				files.forEach(function (file) {
					var tmpResult={};

					var rFilter = /(jpeg|png|gif|bmp|jpg|tiff)$/i;
					if (rFilter.test(file.photoPath)) {
						tmpResult["_id"]=file._id;
						tmpResult['coverId']=file.coverId;
						tmpResult["photoPath"]=file.photoPath;
						tmpResult['albumTitle']=file.albumTitle;
						tmpResult['albumSummary']=file.albumSummary;
						results.push(tmpResult);
					}
					count--;
					if (count <= 0) {
						//console.log(results);
						if(cb) cb(results);
					}
				});
			}
			else { throw err;}
		});
	} else{
		if(cb) {
			cb();
		} else{
			throw null;
		}
	}
};

exports.save = function(album,callback) {
	new Model({
		coverId:album.coverId,
		photoPath:album.photo.filename,
		albumTitle:album.title,
		albumSummary:album.summary
	}).save(function (err, album, count) {
		if(!err && callback) callback(album);
	});

};

exports.doUpdate=function(album,callback){
	// Model.findOne({ coverId: album.coverId}, function (err, doc){
	// 	doc.albumTitle = album.title;
	// 	doc.albumSummary = album.summary;
	// 	doc.visits.$inc();
	// 	doc.save();
	// });

	Model.update({  coverId: album.coverId}, { $set: { albumTitle: album.title, albumSummary: album.summary} }, { upsert: true ,multi: true}, function(){
		callback();
	});


	// Model.update({ coverId: album.coverId }, { $set: { albumTitle: album.title,albumSummary:album.summary}},
	// function (err) {
	// 	if (!err){
	// 		if(callback) callback();
	// 	}
	// 	else { throw err;}
	// });
};

exports.remove=function(req,res,callback){
	Model.remove({ _id: req.params._id }, function (err) {
		if (!err){
			if(callback) callback();
			else res.send(200);
		}
		else { throw err;}
	});
};

exports.Model=Model;
