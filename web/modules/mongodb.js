var mongoose = require('mongoose'),
	settings = require('../settings');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log('mongodb://'+ settings.host +':'+ settings.port +'/'+ settings.db)
});

mongoose.connect('mongodb://'+ settings.host +':'+ settings.port +'/'+ settings.db);

exports.mongoose = mongoose;