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
	newInfo.Count = newInfo.Count || 0;
	Category.create(newInfo, function (err, doc){
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
	var option = {
		sort: {
			Sort: 1
		}
	};

	Category.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.remove = function(Ids, cb){
	Category.remove({
		_id: {
			'$in': Ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 0, '删除成功', count);
	});
};