/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

// biz
var Comment = require('../biz/comment');

/**
 * 最新的N条评论
 *
 * @params
 * @return
 */
exports.findNewTopN = function(num, cb){
	Comment.findNewTopN(num, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};