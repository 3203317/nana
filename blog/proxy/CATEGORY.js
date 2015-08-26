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
var Category = require('../biz/category');

(function (exports, global){
	function func(cb){
		Category.getAll(function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * 获取所有分类
	 *
	 * @params
	 * @return
	 */
	exports.getAll = function(cb){
		cache.get('CategoryAllList', conf.html.cache_time, [func], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);