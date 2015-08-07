/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy'),
	path = require('path'),
	cwd = process.cwd();

var conf = require('../../settings');

var proxy = {
	category: require('../../proxy/CATEGORY')
};

var biz = {
	user: require('../../biz/user'),
	comment: require('../../biz/comment'),
	link: require('../../biz/link'),
	article: require('../../biz/article'),
	category: require('../../biz/category')
};

/**
 *
 * @params
 * @return
 */
exports.createUI = function(req, res, next){
	var user = req.session.user;

	biz.category.getAll(function (err, docs){
		if(err) return next(err);
		var allCategorys = docs;

		res.render('back/article/Create', {
			conf: conf,
			title: '发表博文 | '+ user.Nickname +'的个人空间 | '+ conf.corp.name,
			description: '',
			keywords: ',发表博文,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5,'+ user.Nickname +'的个人空间',
			loginState: 2 === req.session.lv,
			virtualPath: '../',
			data: {
				user: user,
				allCategorys: allCategorys
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.create = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;

	biz.article.saveNew(data, function (err, doc){
		if(err) return next(err);
		result.success = !!doc;
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

	biz.article.remove(aid, user._id, function (err, count){
		if(err) return next(err);
		result.success = !!count;
		res.send(result);
	});
};

/**
 *
 * @params
 * @return
 */
exports.editUI = function(req, res, next){
	var aid = req.params.aid,
		user = req.session.user;

	var ep = EventProxy.create('article', 'allCategorys', function (article, allCategorys){
		res.render('back/article/Edit', {
			conf: conf,
			title: '修改博文 | '+ user.Nickname +'的个人空间 | '+ conf.corp.name,
			description: '',
			keywords: ',修改博文,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5,'+ user.Nickname +'的个人空间',
			loginState: 2 === req.session.lv,
			virtualPath: '../../',
			data: {
				article: article,
				allCategorys: allCategorys
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	biz.article.findById(aid, function (err, doc){
		if(err) return ep.emit('error', err);
		if(!doc) return ep.emit('error', new Error('Not Found.'));
		if(doc.User_Id.toString() !== user._id.toString())
			return ep.emit('error', new Error('Not Permit.'));
		ep.emit('article', doc);
	});

	biz.category.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('allCategorys', docs);
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

	biz.article.editInfo(data, function (err, doc){
		if(err) return next(err);
		result.success = !!doc;
		res.send(result);
	});
};