/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../../settings');

var biz = {
	tag: require('../../biz/tag')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.tag.getAll(function (err, docs){
		if(err) return next(err);
		res.render('manage/article/tag/Index', {
			conf: conf,
			title: '文章标签 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			data: {
				tags: docs
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
	biz.tag.saveNew(data, function (err, docs){
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
	biz.tag.remove(data.ids, function (err, count){
		if(err) return next(err);
		result.success = count === data.ids.length;
		res.send(result);
	});
};

/**
 *
 * @params
 * @return
 */
exports.id = function(req, res, next){
	var result = { success: false },
		id = req.params.id;
	biz.tag.findById(id, function (err, doc){
		if(err) return next(err);
		/* result */
		result.success = !!doc;
		result.data = doc;
		res.send(result);
	});
};

/**
 *
 * @params
 * @return
 */
exports.edit = function(req, res, next){
	var result = { success: false },
		data = req._data;
	biz.tag.editInfo(data, function (err, count){
		if(err) return next(err);
		result.success = !!count;
		res.send(result);
	});
};