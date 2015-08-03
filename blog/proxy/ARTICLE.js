/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

// biz
var Article = require('../biz/article');


/**
 * topmarks
 *
 * @params
 * @return
 */
exports.findBookmarkTopN = function(num, cb){
	Article.findBookmarkTopN(num, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 获取热门文章前N
 *
 * @params
 * @return
 */
exports.findHotTopN = function(num, cb){
	Article.findHotTopN(num, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};