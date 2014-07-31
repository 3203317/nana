var models = require('../models'),
	Article = models.Article;

/**
 * 保存新文章
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Article.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

/**
 * 查询所有文章
 *
 * @params {ObjectId}
 * @params {Function} cb
 * @return
 */
exports.findAll = function(user_id, cb){
	Article.find(null, null, {
		sort: {
			PostTime: -1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};

/**
 * 分页查询
 *
 * @params {Array} page
 * @params {Function} cb
 * @return
 */
exports.findByViewCount = function(page, cb){
	var option = {
		skip: 0,
		limit: 10,
		sort: {
			ViewCount: -1
		}
	};

	if(page){
		option.limit = page[1];
		option.skip = ((page[0] - 1) * option.limit);
	}

	Article.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};

/**
 * 通过id查询
 *
 * @params {String}
 * @params {Function} cb
 * @return
 */
exports.findById = function(id, cb){
	Article.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};