var db=require('./dbengine.js'),
fs = require('fs');


exports.listFoto=function(cb){
	fs.readdir("./uploads", function (err, files) {
		var count = files.length,
		results =new Array() ;
		files.forEach(function (filename) {
			fs.readFile(filename, function (data) {
				var tmpResult={};
				tmpResult["imageName"]=filename;
				tmpResult["imagePath"] = "./public/images/"+filename;
				results[count-1]=tmpResult ;
				count--;
				if (count <= 0) {
					console.log(results);
					if(cb) cb(results);
				}
			});
		});

	});
};