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