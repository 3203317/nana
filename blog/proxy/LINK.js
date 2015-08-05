/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../settings');

// biz
var Link = require('../biz/link');

(function (exports, global){
	var timeout = conf.html.cache_time;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * 获取全部常用链接
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

		Link.getAll(null, function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, docs);
		});
	};
})(exports);