var fs = require('fs'),
path = require('path'),
im = require('imagemagick'),
formidable = require('formidable'),
photoService =require('./photos');
	
	
var NUM_FILES = 0,
PAUSE_TIME = 1000,
MAX_SIZE = 50*1024*1024, // 50MB
EXTENSIONS = ['png', 'jpeg', 'jpg','gif','tiff','bmp'], // jpegs and pngs only
PREVIEW_SIZES = [64, 128, 320, 820, 1095,1370,1645],
BANNER_SIZE= ['full','mid','onethird','twothirds'];


function processImage(file,cropping, bannersize,cb) {
	im.identify(file.path.slice(0,file.path.lastIndexOf('/')+1)+file.name, function(err, features) {
		if (err&&cb) {
			cb(err);
			console.log(err);
			return;
		}
		if (['JPEG', 'PNG','GIF','BMP','JPG','TIFF'].indexOf(features.format) == -1) {
			cb("Unknown image type.");
			return;
		}
 
		var image = features;
		image.url = file.path.slice(0,file.path.lastIndexOf('/')+1)+file.name;
		image.previews = {};
 
		var requiredSizes = [],
		processedSizes = 0;
 
		// collect the preview sizes that are smaller than the image
		for (var i=0; i<PREVIEW_SIZES.length; i++) {
			var size = PREVIEW_SIZES[i];
			if (size < features.width) {
				requiredSizes.push(size);
			}
		}
 
		function getPreviewPath(size) {
			var dirPath = process.cwd()+'/preview/'+file.name+'/'+size;
			return dirPath+'/'+file.name;
		}
 
		// create the previews and load in metadata
		function resized(size, err) {
			if (err) {
				identified(size, err);
			} else {
				var previewPath = getPreviewPath(size);
				im.identify(previewPath, function(err, previewFeatures) {
					identified(size, err, previewFeatures);
				});
			}
		}
		function identified(size, err, previewFeatures) {
			// TODO: deal with errors
			if (previewFeatures) {
				var previewPath = getPreviewPath(size);
				image.previews[size] = previewFeatures;
				image.previews[size].url = previewPath;
			}
			processedSizes += 1;
			if (processedSizes == requiredSizes.length) {
				// and we're done!
				cb(null, image);
			}
		}
		function resize(size) {			
			var previewPath = dirPath+'/'+bannersize+'_'+size+'_'+file.name;
			im.resize({
				srcPath: dirPath+'/'+bannersize+'_'+file.name,
				dstPath: previewPath,
				width:   size,
				height:  ''
			}, function(err, stdout, stderr) {
				resized(size, err, stdout, stderr);
			});
		}
	
		var dirPath = process.cwd()+'/preview/'+file.name;
		try {
			fs.mkdirSync(dirPath, 0755); // sync!
		} catch(e) {
			console.log(e);
		}
		
		
		im.convert([ file.path.slice(0,file.path.lastIndexOf('/')+1)+file.name, 
		"-crop", 
		cropping.w+"x"+cropping.h+"+"+(cropping.x<0?0:cropping.x)+"+"+(cropping.y<0?0:cropping.y), 
		dirPath+'/'+bannersize+'_'+file.name
		], function(err) { 
			if(err) { 
				cb(err); 
			}else{
				for (var i=0; i<requiredSizes.length; i++) {
					resize(requiredSizes[i]);
				}
			}
		});
		
		
	});
}

/**
 * Formidable Upload
 * @public
 * @param {Object} req request context
 * @param {Object} res response context
 * @returns Function
 */
exports.upload=function(req,res){

	var form = new formidable.IncomingForm({
		limit:'50mb',
		keepExtensions:true,
		encoding:'utf-8',
		multiples:true,
		uploadDir:process.cwd()+'/uploads'
	}),
	fields = [],
	files = [];
	// form.uploadDir = process.cwd() + '/uploads';
	// form.encoding = 'binary';
	// form.keepExtensions = true;
	// form.encoding = 'utf-8';
	// form.multiples = true;

	// form.addListener('file', function(name, file) {
	// 	// do something with uploaded file
	// });

	// form.addListener('end', function() {
	// 	res.end(200);
	// });

	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
		}
	});
	
	form.on('error', function(err){
		console.log(err);
		req.resume();
	});

	form.on('field', function(field, value){
		console.log(field, value);
		fields.push([field, value]);
	});

	form.on ('fileBegin', function(name, file){
		file.path = form.uploadDir + "/" + file.name;
	});

	form.on('file', function(name, file){
		console.log(name, file);
		//fs.renameSync(file.path, form.uploadDir + "/" + file.name);
		fs.rename(file.path, form.uploadDir + "/" + file.name);
		files.push([name, file]);
	});

	form.on('end', function(){
		console.log('-> upload done');
		res.writeHead(200, {'content-type': 'text/plain'});
		// res.render('/backend/gallery/add');
	});

	form.on('aborted', function(err) {
		console.log("user aborted upload");
	});
};

/**
 * Legacy File Upload
 * @public
 * @param {Object} req request context
 * @param {Object} res response context
 * @returns Function
 */
exports.legacyUpload=function(req,res){
	var cropping=[],files=[];
	
	if(!req.files || !req.files.files || req.files.files.length==0){
		res.send(JSON.stringify({error: "No name specified."}));
		return;
	}
	JSON.parse(req.body.jcrop_api).forEach(function(el){
		cropping.push(el);	
	});
	var checkFile=function(file){
		var extension = path.extname(file.name).toLowerCase();
		if (EXTENSIONS.indexOf(extension.substr(1)) == -1) {
			res.send(JSON.stringify({error: "Unknown image type."}));
			return false;
		}
 
		var fileName = path.basename(file.name, extension)+extension;
		if (fileName == extension) {
			res.send(JSON.stringify({error: "Invalid name."}));
			return false;
		}
 
		var size = parseInt(file.size, 10);
		if (!size || size < 0) {
			res.send(JSON.stringify({error: "No size specified."}));
			return false;
		}
 
		if (size > MAX_SIZE) {
			res.send(JSON.stringify({error: "Too big."}));
			return false;
		}
	};
	try{
		req.files.files.forEach(function(file){
			files.push(file);
		});	
	}catch(e){
		files.push(req.files.files);
	}
	files.forEach(function(file){
		checkFile(file);
		fs.rename(
			file.path,
			process.cwd() + "/uploads/"+file.name,
			function(error) {
				if(error) {
					res.send({
						error: 'Ah crap! Something bad happened'
					});
					return;
				}
				photoService.save({
					title:  '',
					content: '',
					tag: '',
					path:process.cwd() + "/uploads/"+file.name
				});
				//console.log(req.body.jcrop_api);
				cropping.forEach(function(cp,idx){
					processImage(file, JSON.parse(cp),BANNER_SIZE[idx], function(err, data) {
						if (err) {
							res.send(JSON.stringify({error: err}));
							// TODO: remove the file.
							return;
						}			
						//res.send(JSON.stringify(data));
					});
				});				
			}
		);
		
	});
	
	
	
};


