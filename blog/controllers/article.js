/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy');

var conf = require('../settings');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

// biz
var Article = require('../biz/article'),
	User = require('../biz/user');

/**
 * 
 * @params
 * @return
 */
function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.padLeft(t.getMonth() + 1, '0', 2);
	var d = util.padLeft(t.getDate(), '0', 2);
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

/**
 * 
 * @params
 * @return
 */
exports.idUI = function(req, res, next){
	Article.findById(req.params.id, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return res.redirect('/');

		var article = doc;
		var ep = EventProxy.create('prev', 'next', 'favs', 'author', function (prev, next, favs, author){
			article.author = author;
			res.render('Article', {
				moduleName: 'archive',
				title: article.Title +' | 档案馆 | '+ title,
				description: ','+ article.Title,
				keywords: ',个人博客,Blog'+ (article.Tags.length ? ','+ article.Tags : ''),
				virtualPath: virtualPath,
				topMessage: getTopMessage(),
				article: article,
				prev: prev,
				next: next,
				favs: favs,
				cdn: conf.cdn
			});
		});

		ep.fail(function (err){
			next(err);
		});

		User.findById(article.User_Id, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('author', doc);
		});

		Article.findNext(article, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('next', doc);
		});

		Article.findPrev(article, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('prev', doc);
		});

		Article.findFav(article, 3, function (err, status, msg, docs){
			if(err) return ep.emit('error', err);
			ep.emit('favs', docs);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.add = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;

	Article.saveNew(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.edit = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;
	data.id = req.params.aid;

	Article.editInfo(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.remove = function(req, res, next){
	var result = { success: false },
		user = req.session.user,
		aid = req.params.aid;

	Article.remove(aid, user._id, function (err, status, msg, count){
		if(err) return next(err);
		result.success = !!count;
		res.send(result);
	});
};