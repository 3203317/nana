/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy'),
	path = require('path'),
	fs = require('fs'),
	velocity = require('velocityjs'),
	cwd = process.cwd();

var conf = require('../../settings'),
	macros = require('../../lib/macro');

var proxy = {
	link: require('../../proxy/LINK'),
	comment: require('../../proxy/COMMENT'),
	category: require('../../proxy/CATEGORY'),
	article: require('../../proxy/ARTICLE')
};

// biz
var biz = {
	article: require('../../biz/article')
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
	var name = req.params.name;

	biz.article.findByCate(name, 1, null, null, function (err, docs){
		if(err) return next(err);
		if(!docs || 0 === docs.length) return res.redirect('/archive/');

		var articleIntros = docs;

		var ep = EventProxy.create('allCategorys', 'bookmarkTopN', 'newCommentTopN', 'usefulLink', 'hotArticleTopN',
			function (allCategorys, bookmarkTopN, newCommentTopN, usefulLink, hotArticleTopN){

			res.render('front/Category_Name', {
				conf: conf,
				title: name +' | 分类 | '+ conf.corp.name,
				moduleName: 'category',
				description: '',
				keywords: ',分类,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5'+ name,
				topMessage: getTopMessage(),
				loadMore: 'archive/category/'+ name,
				loginState: 2 === req.session.lv,
				data: {
					hotArticleTopN: hotArticleTopN,
					usefulLink: usefulLink,
					newCommentTopN: newCommentTopN,
					bookmarkTopN: bookmarkTopN,
					allCategorys: allCategorys,
					articleIntros: articleIntros
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

		proxy.article.findBookmarkTopN(5, function (err, docs){
			if(err) return ep.emit('error', err);
			ep.emit('bookmarkTopN', docs);
		});

		proxy.category.getAll(function (err, docs){
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
	var result = { success: false },
		data = req._data;

	if(!data.curPage) return res.send(result);

	/* 获取下一页的文章列表 */
	biz.article.findByCate(req.params.name, data.curPage, null, null, function (err, docs){
		if(err) return next(err);

		if(!docs || 0 === docs.length){
			result.msg = 'size: 0.';
			return res.send(result);
		}

		exports.getTemplate(function (err, template){
			if(err) return next(err);

			var html = velocity.render(template, {
				conf: conf,
				data: { articleIntros: docs }
			}, macros);

			result.success = true;
			result.data = html;
			res.send(result);
		});
	});
};

(function (exports){
	var temp = null;

	/**
	 * 获取模板
	 *
	 * @params
	 * @return
	 */
	exports.getTemplate = function(cb){
		if(temp) return cb(null, temp);

		fs.readFile(path.join(cwd, 'views', 'front', '_pagelet', 'Side.ArticleIntros.vm.html'), 'utf8', function (err, template){
			if(err) return cb(err);
			temp = template;
			cb(null, temp);
		});
	};
})(exports);