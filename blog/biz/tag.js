var ObjectId = require('mongodb').ObjectID;

var models = require('../models'),
	Tag = models.Tag;

/**
 * 保存新
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Tag.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

/**
 * 查询
 *
 * @params {Function} cb
 * @return
 */
exports.findAll = function(cb){
	var option = {
		sort: {
			TagName: 1
		}
	};

	Tag.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};