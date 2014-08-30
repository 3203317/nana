var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Category = require('../biz/category'),
	Tag = require('../biz/tag');

exports.indexUI = function(req, res, next){
	res.render('manage/Index', {
		title: '后台管理 - '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.article_category_indexUI = function(req, res, next){
	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/category/Index', {
			title: '文章分类 - 后台管理 - '+ title,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			virtualPath: virtualPath,
			categorys: docs,
			cdn: conf.cdn
		});
	});
};

exports.article_category_add = function(req, res, next){
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

exports.article_category_del = function(req, res, next){
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
 * @params
 * @params
 * @return
 */
exports.article_tag_indexUI = function(req, res, next){
	Tag.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/tag/Index', {
			title: '文章标签 - 后台管理 - '+ title,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			virtualPath: virtualPath,
			tags: docs,
			cdn: conf.cdn
		});
	});
};

exports.article_tag_add = function(req, res, next){
	var result = { success: false },
		data = req._data,
		user = req.session.user;
	data.User_Id = user._id;
	Tag.saveNew(data, function (err, status, msg, docs){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

exports.article_tag_del = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Tag.remove(data.Ids, function (err, status, msg, count){
		if(err) return next(err);
		result.success = count === data.Ids.length;
		result.msg = msg;
		res.send(result);
	});
};