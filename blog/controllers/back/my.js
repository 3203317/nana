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
	article: require('../../biz/article')
};

/**
 * 验证用户是否存在
 *
 * @params
 * @return
 */
exports.valiUserName = function(req, res, next){
	var name = req.params.name,
		user = req.session.user;

	if(!!user && name === user.UserName){
		req.flash('user', user);
		return next();
	}

	biz.user.findByName(name, function (err, doc){
		if(err) return next(err);
		if(!doc) return res.redirect('/');
		req.flash('user', doc);
		next();
	});
};

/**
 * 
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	var user = req.flash('user')[0];

	var ep = EventProxy.create('newCommentTopN', 'hotArticleTopN', 'articles', 'allCategorys', function (newCommentTopN, hotArticleTopN, articles, allCategorys){
		res.render('back/My', {
			conf: conf,
			title: user.Nickname +'的个人空间 | '+ conf.corp.name,
			description: '',
			keywords: ',个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5,'+ user.Nickname +'的个人空间',
			data: {
				user: user,
				articles: articles,
				allCategorys: allCategorys,
				hotArticleTopN: hotArticleTopN,
				newCommentTopN: newCommentTopN
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	biz.article.getAll(user._id, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('articles', docs);
	});

	proxy.category.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('allCategorys', docs);
	});

	biz.article.findHotTopN(10, user._id, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hotArticleTopN', docs);
	});

	biz.comment.findNewTopN(5, user._id, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCommentTopN', docs);
	});
};