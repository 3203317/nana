/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Tag = models.Tag;

/**
 *
 * @params
 * @return
 */
exports.findByNames = function(names, cb){
	var arr = [];

	for(var s in names){
		arr.push(new RegExp('^'+ names[s] +'$', 'i'));
	}

	Tag.find({
		TagName: { '$in': arr }
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.findById = function(id, cb){
	Tag.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 获取所有
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	var option = {
		sort: { TagName: 1 }
	};

	Tag.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 新增
 *
 * @params
 * @return
 */
exports.saveNew = function(newInfo, cb){
	newInfo.Count = newInfo.Count || 0;
	Tag.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 删除
 *
 * @params
 * @return
 */
exports.remove = function(ids, cb){
	Tag.remove({
		_id: { '$in': ids }
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

/**
 * 编辑
 *
 * @params
 * @return
 */
exports.editInfo = function(newInfo, cb){
	Tag.update({
		_id: newInfo.id
	}, {
		TagName: newInfo.TagName
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};