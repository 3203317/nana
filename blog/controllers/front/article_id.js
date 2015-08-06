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

var biz = {
	article: require('../../biz/article'),
	user: require('../../biz/user')
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

	biz.article.findById(req.params.id, function (err, doc){
		if(err) return res.redirect('/archive/');
		if(!doc) return res.redirect('/archive/');

		var article = doc;

		var ep = EventProxy.create('favs', 'prev', 'next', 'author', 'allCategorys', 'newCommentTopN', 'usefulLink', 'hotArticleTopN',
			function (favs, prev, next, author, allCategorys, newCommentTopN, usefulLink, hotArticleTopN){
			article.author = author;

			res.render('front/Article_Id', {
				conf: conf,
				title: article.Title +' | 档案馆 | '+ conf.corp.name,
				moduleName: 'archive',
				description: '',
				keywords: ',档案馆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5,'+ (article.Tags.length ? ','+ article.Tags : ''),
				topMessage: getTopMessage(),
				loginState: 2 === req.session.lv,
				data: {
					hotArticleTopN: hotArticleTopN,
					usefulLink: usefulLink,
					newCommentTopN: newCommentTopN,
					allCategorys: allCategorys,
					article: article,
					prev: prev,
					next: next,
					favs: favs
				}
			});
		});

		ep.fail(function (err){
			next(err);
		});

		biz.article.findFav(article, null, function (err, docs){
			if(err) return ep.emit('error', err);
			ep.emit('favs', docs);
		});

		biz.article.findNext(article._id, function (err, doc){
			if(err) return ep.emit('error', err);
			ep.emit('next', doc);
		});

		biz.article.findPrev(article._id, function (err, doc){
			if(err) return ep.emit('error', err);
			ep.emit('prev', doc);
		});

		biz.user.findById(article.User_Id, function (err, doc){
			if(err) return ep.emit('error', err);
			ep.emit('author', doc);
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

		proxy.category.getAll(function (err, docs){
			if(err) return ep.emit('error', err);
			ep.emit('allCategorys', docs);
		});
	});	
};