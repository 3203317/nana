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
			TagName: 1
		}
	};

	Tag.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findByNames = function(names, cb){
	var arr = [];

	for(var s in names){
		arr.push(new RegExp('^'+ names[s] +'$', 'i'));
	}

	Tag.find({
		TagName: {
			'$in': arr
		}
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};