var models = require('../models'),
	User = models.User,
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

	/* 标签转换 */
	var tags = newInfo.Tags.split(',');
	newInfo.Tags = [];
	for(var s in tags){
		if('' !== tags[s]) newInfo.Tags.push(tags[s]);
	}

	Article.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.editInfo = function(newInfo, cb){
	newInfo.Bookmark = newInfo.Bookmark || 0;
	newInfo.Topmark = newInfo.Topmark || 0;

	/* 标签转换 */
	var tags = newInfo.Tags.split(',');
	newInfo.Tags = [];
	for(var s in tags){
		if('' !== tags[s]) newInfo.Tags.push(tags[s]);
	}

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
 * 获取文章集合中的作者主键，过滤重复内容
 *
 * @params {Object} articles
 * @return {Array}
 */
function getUsersByArticles(articles){
	var article,
		user_ids = [],
		user_id;
	for(var i in articles){
		article = articles[i];
		user_id = article.User_Id.toString();
		if(0 > user_ids.indexOf(user_id)){
			user_ids.push(user_id);
		}
	}
	return user_ids;
}

/**
 * 为数据集附加字段
 *
 * @params {Object} articles
 * @params {Function} cb
 * @return {Array}
 */
function attachData(articles, cb){
	if(!articles || !articles.length) return cb(null, articles);
	var user_ids = getUsersByArticles(articles);

	User.find({
		_id: {
			'$in': user_ids
		}
	}, null, null, function (err, docs){
		if(err) return cb(err);
		var user,
			article;
		for(var i in docs){
			user = docs[i];

			for(var j in articles){
				article = articles[j];
				if(user._id.toString() === article.User_Id.toString()){
					article.author = user;
				}
			}
		}
		cb(null, articles);
	});
}

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
			params = params || {};
			params._id = {
				'$lt': page[1]
			};
		}
	}

	if(!!user_id){
		params = params || {};
		params.User_Id = user_id;
	}

	Article.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		attachData(docs, function(err, docs){
			if(err) return cb(err);
			cb(null, 0, null, docs);
		});
	});
};

exports.findAllByTag = function(name, sort, page, user_id, cb){
	var option = {
		sort: sort
	};

	var params = {
		Tags: new RegExp('^'+ name +'$', 'i')
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
		attachData(docs, function(err, docs){
			if(err) return cb(err);
			cb(null, 0, null, docs);
		});
	});
};

exports.findAllByCate = function(name, sort, page, user_id, cb){
	var option = {
		sort: sort
	};

	var params = {
		Cate: new RegExp('^'+ name +'$', 'i')
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
		attachData(docs, function(err, docs){
			if(err) return cb(err);
			cb(null, 0, null, docs);
		});
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
			_id: -1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 0, null, docs);
	});
};

exports.findPrev = function(article, cb){
	Article.findOne({
		_id: {
			$gt: article._id
		}
	}, null, {
		sort: {
			_id: 1
		}
	}, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.findNext = function(article, cb){
	Article.findOne({
		_id: {
			$lt: article._id
		}
	}, null, {
		sort: {
			_id: -1
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