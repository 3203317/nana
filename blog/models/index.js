/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var mongoose = require('mongoose'),
	db = mongoose.connection;

var settings = require('../settings');

var url = 'mongodb://'+ settings.user +':'+ settings.pass +'@'+ settings.host +':'+ settings.port +'/'+ settings.db;

db.on('error', console.error);
db.once('open', function(){
	console.log(url);
});

mongoose.connect(url, function (err){
	if(err){
		console.error('Connect to %s Error: %s.', url, err.message);
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
