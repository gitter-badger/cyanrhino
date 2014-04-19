var fs = require('fs'),
path = require('path'),
im = require('imagemagick'),
formidable = require('formidable');
	
	
var NUM_FILES = 0,
PAUSE_TIME = 1000,
MAX_SIZE = 200*1024*1024, // 2MB
EXTENSIONS = ['png', 'jpeg', 'jpg'], // jpegs and pngs only
PREVIEW_SIZES = [64, 128, 256, 512, 768, 1024];	

function processImage(number, name, cb) {
	var imagePath = 'media/'+number+'/'+name;
	im.identify(imagePath, function(err, features) {
		if (err) {
			cb(err);
			return;
		}
 
		if (['JPEG', 'PNG'].indexOf(features.format) == -1) {
			cb("Unknown image type.");
			return;
		}
 
		var image = features;
		image.url = imagePath;
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
			var dirPath = 'media/'+number+'/'+size;
			return dirPath+'/'+name;
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
			var dirPath = 'media/'+number+'/'+size;
			try {
				fs.mkdirSync(dirPath, 0755); // sync!
			} catch(e) {
			}
			var previewPath = dirPath+'/'+name;
			im.resize({
				srcPath: imagePath,
				dstPath: previewPath,
				width:   size,
				height:  ''
			}, function(err, stdout, stderr) {
				resized(size, err, stdout, stderr);
			});
		}
		for (var i=0; i<requiredSizes.length; i++) {
			resize(requiredSizes[i]);
		}
	});
}
exports.upload=function(req,res){

	var form = new formidable.IncomingForm(),
	fields = [],
	files = [];
	form.uploadDir = process.cwd() + '/public/uploads';
	form.encoding = 'binary';
	form.keepExtensions = true;
	form.parse(req);
	// form.encoding = 'utf-8';	

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
		res.writeHead(200, {'content-type': 'text/plain'});
	});

	form.on('field', function(field, value){
		console.log(field, value);
		fields.push([field, value]);
	});

	form.on('file', function(name, file){
		console.log(name, file);
		files.push([name, file]);
		console.log(file.path+file.name+file.type);
	});

	form.on('end', function(){
		console.log('-> upload done');
		res.writeHead(200, {'content-type': 'text/plain'});
	});


	  

	var name = req.headers['x-filename'];
	// if (!name) {
// 		res.send(JSON.stringify({error: "No name specified."}));
// 		return;
// 	}
 
	var extension = path.extname(name).toLowerCase();
	// if (EXTENSIONS.indexOf(extension.substr(1)) == -1) {
	// 	res.send(JSON.stringify({error: "Unknown image type."}));
	// 	return;
	// }
 
	var fileName = path.basename(name, extension)+extension;
	if (fileName == extension) {
		res.send(JSON.stringify({error: "Invalid name."}));
		return;
	}
 
	var size = parseInt(req.headers['content-length'], 10);
	if (!size || size < 0) {
		res.send(JSON.stringify({error: "No size specified."}));
		return;
	}
 
	if (size > MAX_SIZE) {
		res.send(JSON.stringify({error: "Too big."}));
		return;
	}
 
	// files go in media/#number#/image.png
	// thumbnails in media/#number#/#sizename#/image.png
	NUM_FILES += 1;
	var fileNumber = NUM_FILES;
	var dirPath = 'media/'+fileNumber+'/';
	try {
		fs.mkdirSync(dirPath, 0755); // sync!
	} catch(e) {
	}
	var filePath = 'media/'+fileNumber+'/'+fileName;
	var bytesUploaded = 0;
	var file = fs.createWriteStream(filePath, {
		flags: 'w',
		encoding: 'binary',
		mode: 0644
	});
 
	req.on('data', function(chunk) {
		if (bytesUploaded+chunk.length > MAX_SIZE) {
			file.end();
			res.send(JSON.stringify({error: "Too big."}));
			// TODO: remove the partial file.
			return;
		}
		file.write(chunk);
		bytesUploaded += chunk.length;
 
		// TODO: measure elapsed time to help ward off attacks?
 
		// deliberately take our time
		req.pause();
		setTimeout(function() {req.resume();}, PAUSE_TIME);
	});
 
	req.on('end', function() {
		file.end();
		processImage(fileNumber, fileName, function(err, data) {
			if (err) {
				// bit of a hack sending the error straight to the client
				res.send(JSON.stringify({error: err}));
				// TODO: remove the file.
				return;
			}
			res.send(JSON.stringify(data));
		})
	});
}


