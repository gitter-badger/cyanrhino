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
	Model.find({coverId:req.param('uuid')}).exec(function(err, files) {
		if (!err){
			var count = files.length,
			results =new Array() ;

			if(0==count){
        		if(cb) cb(results);
			}

			files.forEach(function (file) {
				var tmpResult={};

				var rFilter = /(jpeg|png|gif|bmp|jpg|tiff)$/i;
				if (rFilter.test(file.photoPath)) {
					tmpResult["_id"]=file._id;
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
		else { cb(null,err);}
	});
};

exports.save = function(album,callback) {	
	new Model({
		coverId:album.coverId,
		photoPath:album.photo.path,
		albumTitle:album.title,
		albumSummary:album.summary
	}).save(function (err, album, count) {
		if(!err && callback) callback(album);
	});
	
};

exports.Model=Model;
