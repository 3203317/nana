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
var Link = require('../../biz/link'),
	Comment = require('../../biz/comment'),
	Category = require('../../biz/category'),
	Article = require('../../biz/article');

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

	var ep = EventProxy.create('archive', 'allCategorys', 'newCommentsTopN', 'usefulLinks', 'hotArticlesTopN',
		function (archive, allCategorys, newCommentsTopN, usefulLinks, hotArticlesTopN){

		res.render('front/archive/Index', {
			conf: conf,
			title: '档案馆 | '+ conf.corp.name,
			moduleName: 'archive',
			description: '',
			keywords: ',档案馆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			topMessage: getTopMessage(),
			data: {
				allCategorys: allCategorys,
				newCommentsTopN: newCommentsTopN,
				usefulLinks: usefulLinks,
				hotArticlesTopN: hotArticlesTopN,
				archive: archive
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Article.getListByViewCount(10, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hotArticlesTopN', docs);
	});

	Link.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('usefulLinks', docs);
	});

	Comment.getList(5, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCommentsTopN', docs);
	});

	Category.getAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('allCategorys', docs);
	});

	Article.procArchive(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('archive', docs);
	});
};