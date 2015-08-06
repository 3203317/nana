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
	link: require('../../proxy/LINK'),
	comment: require('../../proxy/COMMENT'),
	category: require('../../proxy/CATEGORY'),
	article: require('../../proxy/ARTICLE')
};

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
exports.indexUI = function(req, res, next){

	var ep = EventProxy.create('allCategorys', 'tag', 'newCommentTopN', 'usefulLink', 'hotArticleTopN',
		function (allCategorys, tag, newCommentTopN, usefulLink, hotArticleTopN){

		res.render('front/tag/Index', {
			conf: conf,
			title: '标签 | '+ conf.corp.name,
			moduleName: 'tag',
			description: '',
			keywords: ',标签,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			topMessage: getTopMessage(),
			loginState: 2 === req.session.lv,
			data: {
				hotArticleTopN: hotArticleTopN,
				usefulLink: usefulLink,
				newCommentTopN: newCommentTopN,
				allCategorys: allCategorys,
				tag: tag
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	proxy.article.findHotTopN(10, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hotArticleTopN', docs);
	});

	proxy.link.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('usefulLink', docs);
	});

	proxy.comment.findNewTopN(5, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCommentTopN', docs);
	});

	proxy.article.procTag(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('tag', docs);
	});

	proxy.category.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('allCategorys', docs);
	});
};