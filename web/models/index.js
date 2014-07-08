var mongoose = require('mongoose'),
	settings = require('../settings');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
	console.log(settings.db)
});

mongoose.connect(settings.db, function (err){
	if(err){
		console.log('Connect to %s Error: ', settings.db, err.message);
		process.exit(1);
	}
});

// models
require('./User');

exports.User = mongoose.model('User');