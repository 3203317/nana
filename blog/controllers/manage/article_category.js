/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../../settings');

var biz = {
	category: require('../../biz/category')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.category.getAll(function (err, docs){
		if(err) return next(err);
		res.render('manage/article/category/Index', {
			conf: conf,
			title: '文章分类 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			data: {
				categorys: docs
			}
		});
	});
};

/**
 * 新增
 *
 * @params
 * @return
 */
exports.create = function(req, res, next){
	var result = { success: false },
		data = req._data,
		user = req.session.user;
	data.User_Id = user._id;
	biz.category.saveNew(data, function (err, docs){
		if(err) return next(err);
		result.success = !!docs;
		result.data = docs;
		res.send(result);
	});
};

/**
 * 删除
 *
 * @params
 * @return
 */
exports.remove = function(req, res, next){
	var result = { success: false },
		data = req._data;
	biz.category.remove(data.ids, function (err, count){
		if(err) return next(err);
		result.success = count === data.ids.length;
		res.send(result);
	});
};