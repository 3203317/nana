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
var Link = require('../biz/link');

(function (exports, global){
	function func(cb){
		Link.getAll(null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}

	/**
	 * 获取全部常用链接
	 *
	 * @params
	 * @return
	 */
	exports.getAll = function(cb){
		cache.get('LinkAllList', conf.html.cache_time, [func], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);