/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var mongoose = require('mongoose'),
	dbconn = mongoose.connection;

var dbconf = require('../settings').db;

var util = require('speedt-utils'),
	mailService = util.service.mail;

var path = require('path'),
	cwd = process.cwd(),
	macros = require('../lib/macro');

var url = 'mongodb://'+ dbconf.user +':'+ dbconf.pass +'@'+ dbconf.host +':'+ dbconf.port +'/'+ dbconf.database;

dbconn.on('error', console.error);
dbconn.once('open', function(){
	console.log(url);
});

mongoose.connect(url, function (err){
	if(!err) return;
	// mongoose error
	console.error('Connect to %s Error: %s.', url, err.message);
	// send mail
	mailService.sendMail({
		subject: 'foreworld.net [Web DB Error]',
		template: [
			path.join(cwd, 'lib', 'ErrorMail.vm.html'), {
				data: {
					error: err,
					time: util.format(new Date(), 'YY-MM-dd hh:mm:ss.S')
				}
			}, macros
		]
	}, function (err, info){
		if(err) console.error(err);
		process.exit(1);
	});
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
