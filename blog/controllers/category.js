/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	path = require('path'),
	cwd = process.cwd();

var conf = require('../settings');

// biz
var Article = require('../biz/article'),
	Category = require('../biz/category');

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
exports.nameUI = function(req, res, next){
	var name = req.params.name;

	Article.findAllByCate(name, {
		Bookmark: -1,
		_id: -1
	}, [10], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.redirect('/archive/');
		res.render('Category', {
			conf: conf,
			title: name +' | 分类 | '+ conf.corp.name,
			moduleName: 'category',
			description: '',
			keywords: ',分类,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5'+ name,
			topMessage: getTopMessage(),
			loadMore: 'archive/category/'+ name,
			data: {
				articles: docs
			}
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.nameUI_more = function(req, res, next){
	var data = req.query.data;
	if(!data) return res.send('');

	try{
		data = JSON.parse(data);
	}catch(ex){
		return res.send('');
	}

	if(!data.Current) return res.send('');

	Article.findAllByCate(req.params.name, {
		Bookmark: -1,
		_id: -1
	}, [10, data.Current], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.send('');
		res.render(path.join(cwd, 'views', 'pagelet', 'ArticleIntros.vm.html'), {
			conf: conf,
			data: {
				articles: docs
			}
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.removes = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Category.remove(data.Ids, function (err, status, msg, count){
		if(err) return next(err);
		result.success = count === data.Ids.length;
		result.msg = msg;
		res.send(result);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.add = function(req, res, next){
	var result = { success: false },
		data = req._data,
		user = req.session.user;
	data.User_Id = user._id;
	Category.saveNew(data, function (err, status, msg, docs){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};