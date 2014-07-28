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
 * @params {Function} cb
 * @return
 */
exports.findAll = function(cb){
	Article.find(null, null, {
		sort: {
			PostTime: -1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};