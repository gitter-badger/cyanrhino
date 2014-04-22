var db=require('./dbengine.js'),
fs = require('fs');


exports.listFoto=function(cb){
	fs.readdir("./uploads", function (err, files) {
		var count = files.length,
		results =new Array() ;
		files.forEach(function (filename) {
			fs.readFile(filename, function (data) {
				var tmpResult={};
				
				var rFilter = /(jpeg|png|gif|bmp|jpg|tiff)$/i;
				if (rFilter.test(filename)) {				
					tmpResult["imageName"]=filename;
					tmpResult["imagePath"] = "/thumb/"+filename+'/full_128_'+filename;
					results.push(tmpResult);
				}
				count--;
				if (count == 0) {
					console.log(results);
					if(cb) cb(results);
				}
			});
		});

	});
};