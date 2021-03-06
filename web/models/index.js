var mongoose = require('mongoose'),
	settings = require('../settings');

var db = mongoose.connection;
var url = 'mongodb://'+ settings.host +':'+ settings.port +'/'+ settings.db;

db.on('error', console.error);
db.once('open', function(){
	console.log(url)
});

mongoose.connect(url, function (err){
	if(err){
		console.log('Connect to %s Error: ', url, err.message);
		process.exit(1);
	}
});

// models
require('./User');
require('./Manager');
require('./Module');

exports.User = mongoose.model('User');
exports.Manager = mongoose.model('Manager');
exports.Module = mongoose.model('Module');