/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

// biz
var Article = require('../biz/article');

(function (exports, global){
	var timeout = 1000 * 30;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * 查找第一页的文章
	 *
	 * @params
	 * @return
	 */
	exports.findFirstPage = function(cb){
		if(!!cache_data){
			if(new Date() < last_time)
				return cb(null, cache_data);
		}

		last_time = new Date();
		last_time = new Date(last_time.valueOf() + timeout);

		Article.findList(1, null, null, function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, docs);
		});
	};
})(exports);

(function (exports, global){
	var timeout = 1000 * 30;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * topmarks
	 *
	 * @params
	 * @return
	 */
	exports.findBookmarkTopN = function(num, cb){
		if(!!cache_data){
			if(new Date() < last_time)
				return cb(null, cache_data);
		}

		last_time = new Date();
		last_time = new Date(last_time.valueOf() + timeout);

		Article.findBookmarkTopN(num, function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, docs);
		});
	};
})(exports);

(function (exports, global){
	var timeout = 1000 * 30;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * 获取热门文章前N
	 *
	 * @params
	 * @return
	 */
	exports.findHotTopN = function(num, cb){
		if(!!cache_data){
			if(new Date() < last_time)
				return cb(null, cache_data);
		}

		last_time = new Date();
		last_time = new Date(last_time.valueOf() + timeout);

		Article.findHotTopN(num, function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, docs);
		});
	};
})(exports);