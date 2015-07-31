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

	var ep = EventProxy.create('allCategorys', 'articleIntros', 'topmarksTopN', 'newCommentsTopN', 'usefulLinks', 'hotArticlesTopN',
		function (allCategorys, articleIntros, topmarksTopN, newCommentsTopN, usefulLinks, hotArticlesTopN){

		res.render('front/Index', {
			conf: conf,
			title: conf.corp.name,
			moduleName: 'index',
			description: '',
			keywords: ',个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			topMessage: getTopMessage(),
			loadMore: 'index',
			data: {
				hotArticlesTopN: hotArticlesTopN,
				usefulLinks: usefulLinks,
				newCommentsTopN: newCommentsTopN,
				topmarksTopN: topmarksTopN,
				allCategorys: allCategorys,
				articleIntros: articleIntros
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Article.getHotArticlesTopN(10, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hotArticlesTopN', docs);
	});

	Link.getUsefulLinks(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('usefulLinks', docs);
	});

	Comment.getNewCommentsTopN(5, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCommentsTopN', docs);
	});

	Article.getTopmarksTopN(5, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('topmarksTopN', docs);
	});

	Article.getArticleIntros(null, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('articleIntros', docs);
	});

	Category.findAllCategorys(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('allCategorys', docs);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.indexUI_more = function(req, res, next){
	var data = req.query.data;
	if(!data) return res.send('');

	try{
		data = JSON.parse(data);
	}catch(ex){
		return res.send('');
	}

	if(!data.Current) return res.send('');

	Article.getArticleIntros(data.Current, function (err, docs){
		if(err) return res.send('');
		if(!docs || 0 === docs.length) return res.send('');
		res.render(path.join(cwd, 'views', 'front', 'pagelet', 'Side.ArticleIntros.vm.html'), {
			conf: conf,
			data: { articleIntros: docs }
		});
	});
};