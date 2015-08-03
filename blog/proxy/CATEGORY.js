/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Category = require('../biz/category');

/**
 * 获取所有分类
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	Category.getAll(function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};