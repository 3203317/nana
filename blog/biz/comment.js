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
		cb(null, 1, null, doc);
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

	if(page){
		option.limit = page[1];
		option.skip = ((page[0] - 1) * option.limit);
	}

	Comment.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};