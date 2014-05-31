var mongoose = require('mongoose');
 
mongoose.Query.prototype.paginate = function(page, limit, callback) {
	var query = this
	, page = page || 1
	, limit = limit || 10
	, offset 	= (limit * page) - limit;
	
	query = query.skip(offset).limit(limit);
	
	if(callback){
		query.exec(function(err, data) {
			if(err){ callback(err, null, null) }
			else {
				query.model.count(query._conditions, function(err, count) {
					callback(null, count, data);
				});
			}
		});
	} else {  throw new Error('pagination needs a callback as the third argument.'); }
};