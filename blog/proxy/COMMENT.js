/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var conf = require('../settings');

// biz
var Comment = require('../biz/comment');

(function (exports, global){
	function func(num, cb){
		Comment.findNewTopN(num, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}

	/**
	 * 最新的N条评论
	 *
	 * @params
	 * @return
	 */
	exports.findNewTopN = function(num, cb){
		cache.get('CommentNewTopN', 1000 * 30, [func, num], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);