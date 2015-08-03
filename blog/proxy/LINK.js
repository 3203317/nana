/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

// biz
var Link = require('../biz/link');

/**
 * 获取全部常用链接
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	Link.getAll(function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};