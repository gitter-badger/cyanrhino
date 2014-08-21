var db=require('./dbengine.js'),
fs = require('fs'),
os=require('os');


var SYSTEM_DELIMITER=os.type().indexOf('Windows')!=-1?'\\':'/';

var layoutSchema = new db.Schema({
	path:String,
	layout:{type: Number, default: 0},
	index:Number
});



var layoutEnum = ['full','mid','onethird','twothirds'];
layoutSchema.methods.getLayout = function () {
  return layoutEnum[this.layout];
}

layoutSchema.methods.getLayoutIndex = function () {
	return layoutEnum.indexOf(this.layout);
}
var Model = db.mongoose.model('Layout', layoutSchema);


exports.post = function(req, res,callback) {
	Model.remove({}, function (err) {
		if (!err){
			if(req.body.data.length<=0) res.send(200);

			err=req.body.data.forEach(function(d){
				new Model({
					path:d.path,
					layout:layoutEnum.indexOf(d.layout),
					index:d.index
				}).save(function (err, photo, count) {
					if(err) res.error(err);
					else return err;
				});
			});
			if(!err && callback) callback();
			else res.send(err);
		}
	});

};


exports.show = (function(req, res,callback) {
	Model.findOne({path:req.params.path}).exec(callback);
});




exports.listFoto=function(cb){
	Model.find({}).sort('index').exec(function(err, files) {
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
					var filename=SYSTEM_DELIMITER.length==1?file.path.slice(file.path.lastIndexOf(SYSTEM_DELIMITER)+1,file.path.length):file.path.slice(file.path.lastIndexOf(SYSTEM_DELIMITER)+1,file.path.length);
					tmpResult["path"] = "/thumb/"+filename+'/'+file.getLayout(file.layout)+'_128_'+filename;
					tmpResult['index']=file.index;
					tmpResult['layout']=file.getLayout(file.layout);
					tmpResult['realPath']="/thumb/"+filename+'/'+file.getLayout(file.layout)+'_'+filename;
					tmpResult['filename']=filename;
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


exports.Model=Model;
