var mongoose = require('mongoose'),
	settings = require('../settings');

var db = mongoose.connection;
var url = 'mongodb://'+ settings.user +':'+ settings.pass +'@'+ settings.host +':'+ settings.port +'/'+ settings.db;

db.on('error', console.error);
db.once('open', function(){
	console.log(url);
});

mongoose.connect(url, function (err){
	if(err){
		console.log('Connect to %s Error: ', url, err.message);
		process.exit(1);
	}
});

// models
require('./User');
require('./Article');
require('./Comment');
require('./Link');
require('./Category');
require('./Tag');
require('./Manager');

exports.User = mongoose.model('User');
exports.Article = mongoose.model('Article');
exports.Comment = mongoose.model('Comment');
exports.Link = mongoose.model('Link');
exports.Category = mongoose.model('Category');
exports.Tag = mongoose.model('Tag');
exports.Manager = mongoose.model('Manager');