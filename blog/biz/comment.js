/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Comment = models.Comment;

/**
 * 最新的N条评论
 *
 * @params
 * @return
 */
exports.findNewTopN = function(num, cb){
	var option = {
		limit: num || 5,
		sort: { PostTime: -1 }
	};

	Comment.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};