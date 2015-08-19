/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	User = models.User,
	Link = models.Link;

/**
 * 获取全部常用链接
 *
 * @params
 * @return
 */
exports.getAll = function(user_id, cb){
	var params = null;
	if(!!user_id){
		params = params || {};
		params.User_Id = user_id;
	}

	Link.find(params, null, { sort: { Sort: 1 } }, function (err, docs){
		if(err) return cb(err);

		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	});
};

/**
 * 为数据集附加字段
 *
 * @params
 * @return
 */
function attachData(links, cb){
	if(!links || 0 === links.length) return cb(null, links);
	var user_ids = getUsersByLinks(links);

	User.find({
		_id: { '$in': user_ids }
	}, null, null, function (err, docs){
		if(err) return cb(err);
		for(var i in docs){
			var user = docs[i];

			for(var j in links){
				var link = links[j];

				if(user._id.toString() === link.User_Id.toString()){
					link.author = user;
				}
			}
		}
		cb(null, links);
	});
}

/**
 * 获取link集合中的作者主键，过滤重复内容
 *
 * @params
 * @return
 */
function getUsersByLinks(links){
	var user_ids = [];
	for(var i in links){
		var link = links[i];
		var user_id = link.User_Id.toString();

		if(0 > user_ids.indexOf(user_id)){
			user_ids.push(user_id);
		}
	}
	return user_ids;
}