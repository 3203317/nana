var models = require('../models'),
	Category = models.Category;

/**
 * 保存新
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Category.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
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
	var option = {
		sort: {
			Sort: 1
		}
	};

	Category.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};