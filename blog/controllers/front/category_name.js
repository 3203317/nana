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
	var name = req.params.name;

	Article.findListByCate(name, {
		Bookmark: -1,
		_id: -1
	}, [10], null, function (err, docs){
		if(err) return next(err);
		if(!docs || 0 === docs.length) return res.redirect('/archive/');
		var articleIntros = docs;

		var ep = EventProxy.create('allCategorys', 'topMarksTopN', 'newCommentsTopN', 'usefulLinks', 'hotArticlesTopN',
			function (allCategorys, topMarksTopN, newCommentsTopN, usefulLinks, hotArticlesTopN){

			res.render('front/Category_Name', {
				conf: conf,
				title: name +' | 分类 | '+ conf.corp.name,
				moduleName: 'category',
				description: '',
				keywords: ',分类,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5'+ name,
				topMessage: getTopMessage(),
				loadMore: 'archive/category/'+ name,
				data: {
					hotArticlesTopN: hotArticlesTopN,
					usefulLinks: usefulLinks,
					newCommentsTopN: newCommentsTopN,
					topMarksTopN: topMarksTopN,
					allCategorys: allCategorys,
					articleIntros: articleIntros
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

		Article.getListByBookmark(5, function (err, docs){
			if(err) return ep.emit('error', err);
			ep.emit('topMarksTopN', docs);
		});

		Category.getAll(function (err, docs){
			if(err) return ep.emit('error', err);
			ep.emit('allCategorys', docs);
		});
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

	Article.findListByCate(req.params.name, {
		Bookmark: -1,
		_id: -1
	}, [10, data.Current], null, function (err, docs){
		if(err) return next(err);
		if(!docs || 0 === docs.length) return res.send('');
		res.render(path.join(cwd, 'views', 'front', 'pagelet', 'Side.ArticleIntros.vm.html'), {
			conf: conf,
			data: { articleIntros: docs }
		});
	});
};