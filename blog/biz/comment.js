/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Comment = models.Comment;

/**
 * 更新用户头像
 *
 * @params
 * @return
 */
exports.updateAuthorAvatar = function(author_id, avatar_url, cb){
	Comment.update({
		Author_Id: author_id
	}, {
		$set: {
			Avatar_Url: avatar_url
		}
	}, {
		multi: true
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

/**
 * 查找全部的用户
 *
 * @params
 * @return
 */
exports.findAuthor = function(cb){
	Comment.distinct('Author_Id', function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 最新的N条评论
 *
 * @params
 * @return
 */
exports.findNewTopN = function(num, user_id, cb){
	var option = {
		limit: num || 5,
		sort: { PostTime: -1 }
	};

	var params = null;
	if(!!user_id){
		// params = params || {};
		// params.User_Id = user_id;
	}

	Comment.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 移除所有
 *
 * @params
 * @return
 */
exports.removeAll = function(cb){
	Comment.remove(null, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

/**
 * 新建评论
 *
 * @params
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Comment.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};