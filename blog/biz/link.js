var models = require('../models'),
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
	Link.find(null, null, {
		sort: {
			Sort: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};