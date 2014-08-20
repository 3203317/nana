var models = require('../models'),
	User = models.User,
	Link = models.Link;

/**
 * 保存新文章
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Link.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 查询
 *
 * @params {String}
 * @params {Function} cb
 * @return
 */
exports.findAll = function(user_id, cb){
	var params = null;

	if(!!user_id){
		params = params || {};
		params.User_Id = user_id;
	}

	Link.find(params, null, {
		sort: {
			Sort: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, 0, null, docs);
		});
	});
};

/**
 * 为数据集附加字段
 *
 * @params {Object} links
 * @params {Function} cb
 * @return {Array}
 */
function attachData(links, cb){
	if(!links || !links.length) return cb(null, links);
	var user_ids = getUsersByLinks(links);

	User.find({
		_id: {
			'$in': user_ids
		}
	}, null, null, function (err, docs){
		if(err) return cb(err);
		var user,
			link;
		for(var i in docs){
			user = docs[i];

			for(var j in links){
				link = links[j];
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
 * @params {Object} links
 * @return {Array}
 */
function getUsersByLinks(links){
	var link,
		user_ids = [],
		user_id;
	for(var i in links){
		link = links[i];
		user_id = link.User_Id.toString();
		if(0 > user_ids.indexOf(user_id)){
			user_ids.push(user_id);
		}
	}
	return user_ids;
}