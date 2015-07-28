/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Comment = models.Comment;

/**
 * 保存新评论
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Comment.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 分页查询
 *
 * @params {Array} page
 * @params {String} user_id
 * @params {Function} cb
 * @return
 */
exports.findAll = function(page, user_id, cb){
	var option = {
		sort: {
			PostTime: -1
		}
	};

	var params = null;

	if(page){
		option.limit = page[0];
		if(!!page[1]){
			params = {};
			params._id = {
				'$lt': page[1]
			};
		}
	}

	Comment.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.removeAll = function(cb){
	Comment.remove(null, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};