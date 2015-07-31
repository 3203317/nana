/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventProxy = require('eventproxy'),
	util = require('speedt-utils');

var conf = require('../../settings');

// biz
var Article = require('../../biz/article'),
	Common = require('../../biz/common'),
	Comment = require('../../biz/comment'),
	Link = require('../../biz/link');

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

	var ep = EventProxy.create('newCommentTop5', 'archive', 'usefulLinks', 'hotArticleTop10',
		function (newCommentTop5, archive, usefulLinks, hotArticleTop10){
		res.render('front/archive/Index', {
			conf: conf,
			title: '档案馆 | '+ conf.corp.name,
			moduleName: 'archive',
			description: '',
			keywords: ',档案馆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			topMessage: getTopMessage(),
			data: {
				hotArticleTop10: hotArticleTop10,
				usefulLinks: usefulLinks,
				newCommentTop5: newCommentTop5,
				archive: archive
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Article.hotArticleTop10(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hotArticleTop10', docs);
	});

	Link.usefulLinks(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('usefulLinks', docs);
	});

	Comment.newCommentTop5(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCommentTop5', docs);
	});

	Common.archives(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('archive', docs);
	});
};