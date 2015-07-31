/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Category = models.Category;

/**
 * 保存新
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	newInfo.Count = newInfo.Count || 0;
	Category.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 获取所有分类
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	var option = {
		sort: { Sort: 1 }
	};

	Category.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.remove = function(Ids, cb){
	Category.remove({
		_id: {
			'$in': Ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 0, '删除成功', count);
	});
};