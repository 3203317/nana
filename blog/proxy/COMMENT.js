/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

// biz
var Comment = require('../biz/comment');

(function (exports, global){
	var timeout = 1000 * 30;
	var cache_data = null;
	var last_time = new Date();
	last_time = new Date(last_time.valueOf() + timeout);

	/**
	 * 最新的N条评论
	 *
	 * @params
	 * @return
	 */
	exports.findNewTopN = function(num, cb){
		if(!!cache_data){
			if(new Date() < last_time)
				return cb(null, cache_data);
		}

		last_time = new Date();
		last_time = new Date(last_time.valueOf() + timeout);

		Comment.findNewTopN(num, function (err, docs){
			if(err) return cb(err);
			cache_data = docs;
			cb(null, cache_data);
		});
	};
})(exports);