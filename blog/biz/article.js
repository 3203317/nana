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
	newInfo.Bookmark = newInfo.Bookmark || 0;
	newInfo.Topmark = newInfo.Topmark || 0;

	Article.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.editInfo = function(newInfo, cb){
	newInfo.Bookmark = newInfo.Bookmark || 0;
	newInfo.Topmark = newInfo.Topmark || 0;

	var id = newInfo.id;
	delete newInfo.id;

	Article.update({
		_id: id
	}, newInfo, function (err, count){
		if(err) return cb(err);
		cb(null, 0, null, count);
	});
};

/**
 * 查询所有文章
 *
 * @params {Object} sort
 * @params {Array} page
 * @params {String} user_id
 * @params {Function} cb
 * @return
 */
exports.findAll = function(sort, page, user_id, cb){
	var option = {
		sort: sort
	};

	var params = null;

	if(page){
		option.limit = page[0];
		if(!!page[1]){
			params = {};
			params._id = {
				'$lt': page[1]
			};
		}
	}

	Article.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findAllByTag = function(name, sort, page, user_id, cb){
	var option = {
		sort: sort
	};

	var params = {
		Tags: new RegExp(','+ name +',', 'i')
	};

	if(page){
		option.limit = page[0];
		if(!!page[1]){
			params._id = {
				'$lt': page[1]
			};
		}
	}

	Article.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findAllByCate = function(name, sort, page, user_id, cb){
	var option = {
		sort: sort
	};

	var params = {
		Cate: new RegExp(name, 'i')
	};

	if(page){
		option.limit = page[0];
		// option.skip = ((page[0] - 1) * option.limit);
		if(!!page[1]){
			params._id = {
				'$lt': page[1]
			};
		}
	}

	Article.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

/**
 * 通过id查询
 *
 * @params {String} id
 * @params {Function} cb
 * @return
 */
exports.findById = function(id, cb){
	Article.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 查询
 *
 * @params {String} user_id
 * @params {Function} cb
 * @return
 */
exports.findTopmarks = function(user_id, cb){
	Article.find({
		Bookmark: 1
	}, null, {
		sort: {
			PostTime: -1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findPrev = function(article, cb){
	Article.findOne({
		PostTime: {
			$gt: article.PostTime
		}
	}, null, {
		sort: {
			PostTime: 1
		}
	}, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.findNext = function(article, cb){
	Article.findOne({
		PostTime: {
			$lt: article.PostTime
		}
	}, null, {
		sort: {
			PostTime: -1
		}
	}, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

/**
 * 查询喜欢的文章
 *
 * @params {Object} article
 * @params {Number} count
 * @params {Function} cb
 * @return
 */
exports.findFav = function(article, count, cb){
	Article.find({
		_id: {
			'$ne': article._id
		},
		Cate: article.Cate
	}, null, {
		limit: count
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};