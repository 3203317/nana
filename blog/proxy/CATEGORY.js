/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Category = require('../biz/category');

(function (exports, global){
	var timeout = 1000 * 30;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * 获取所有分类
	 *
	 * @params
	 * @return
	 */
	exports.getAll = function(cb){
		if(!!cache_data){
			if(new Date() < last_time)
				return cb(null, cache_data);
		}

		last_time = new Date();
		last_time = new Date(last_time.valueOf() + timeout);

		Category.getAll(function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, docs);
		});
	};
})(exports);