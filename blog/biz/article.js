/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	User = models.User,
	Article = models.Article;

var macros = require('../lib/macro');

var tag  = require('./tag');

/**
 * 标签馆
 *
 * @params
 * @return
 */
exports.procTag = function(cb){
	var that = this;

	tag.findAll(null, function (err, status, msg, docs){
		if(err) return cb(err);

		/* 获取全部的标签 */
		var tags = docs;

		that.findAll({
			_id: -1
		}, null, null, function (err, docs){
			if(err) return cb(err);

			var articles = docs;

			var tagList = [];

			for(var i in tags){
				var tag = tags[i];

				var tag_2 = {
					Id: tag._id,
					TagName: tag.TagName,
					Articles: []
				};
				tagList.push(tag_2);

				for(var j in articles){
					var article = articles[j];

					if(article.Tags && article.Tags.length && -1 < ((','+ article.Tags +',').toLowerCase()).indexOf(','+ tag.TagName.toLowerCase() +',')){
						tag_2.Articles.push(article);
					}
				}
			}

			/* 未添加标签的归为一类 */
			var tag_3 = {
				Id: '',
				TagName: '未归类',
				Articles: []
			};
			tagList.push(tag_3);

			for(var j in articles){
				var article = articles[j];

				if(!article.Tags.length){
					tag_3.Articles.push(article);
				}
			}

			cb(null, tagList);
		});
	});
};

/**
 * 档案馆
 *
 * @params
 * @return
 */
exports.procArchive = function(cb){
	this.findAll({
		_id: -1
	}, null, null, function (err, docs){
		if(err) return cb(err);

		/* 生成档案馆对象 */
		var archives = [],
			archive,
			articles = docs,
			article,
			archiveChild;

		for(var i in articles){
			article = articles[i];

			if(archives.length){
				/* 获取最后一条记录年 */
				archive = archives[archives.length - 1];

				if(article.PostTime.getFullYear() == archive.Y4){
					/* 获取最后一条记录月 */
					archiveChild = archive.ArchiveChildren[archive.ArchiveChildren.length - 1];
					if(macros.toMon(article.PostTime) == archiveChild.M2){
						archiveChild.Articles.push(article);
					}else{
						archiveChild = {
							'M2': macros.toMon(article.PostTime),
							'Articles': []
						};

						archiveChild.Articles.push(article);
						archive.ArchiveChildren.push(archiveChild);
					}

				}else{
					/* 添加年 */
					archive = {
						'Y4': article.PostTime.getFullYear(),
						'ArchiveChildren': []
					};

					/* 添加月 */
					archiveChild = {
						'M2': macros.toMon(article.PostTime),
						'Articles': []
					}

					archiveChild.Articles.push(article);
					archive.ArchiveChildren.push(archiveChild);
					archives.push(archive);
				}
			}else{
				/* 添加年 */
				archive = {
					'Y4': article.PostTime.getFullYear(),
					'ArchiveChildren': []
				};

				/* 添加月 */
				archiveChild = {
					'M2': macros.toMon(article.PostTime),
					'Articles': []
				}

				archiveChild.Articles.push(article);
				archive.ArchiveChildren.push(archiveChild);
				archives.push(archive);
			}
		}
		cb(null, archives);
	});
};

/**
 * 文章简介
 *
 * @params
 * @return
 */
exports.getList = function(current, cb){
	var num = 10;  // 每页10
	this.findAll({
		Topmark: -1,
		_id: -1
	}, [num, current], null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * topmarks
 *
 * @params
 * @return
 */
exports.getListByBookmark = function(num, cb){
	num = num || 5;
	Article.find({ Bookmark: 1 }, null, {
		sort: { _id: -1 }
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 获取热门文章前N
 *
 * @params
 * @return
 */
exports.getListByViewCount = function(num, cb){
	num = num || 10;  // 10
	this.findAll({ ViewCount: -1 }, [num], null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 保存新文章
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	/* 标签转换 */
	procTags(newInfo);

	saveTags(newInfo.Tags, function (err){
		if(err) return cb(err);
		/* start save */
		newInfo.Bookmark = newInfo.Bookmark || 0;
		newInfo.Topmark = newInfo.Topmark || 0;
		/* last */
		Article.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 0, null, doc);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.editInfo = function(newInfo, cb){
	/* 标签转换 */
	procTags(newInfo);

	saveTags(newInfo.Tags, function (err){
		if(err) return cb(err);
		/* start save */
		newInfo.Bookmark = newInfo.Bookmark || 0;
		newInfo.Topmark = newInfo.Topmark || 0;
		/* first */
		var id = newInfo.id;
		var user_id = newInfo.User_Id;
		delete newInfo.id;
		delete newInfo.User_Id;
		/* second */
		Article.update({
			_id: id,
			User_Id: user_id
		}, newInfo, function (err, count){
			if(err) return cb(err);
			cb(null, 0, null, count);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
function saveTags(tags, cb){
	cb(null);
	// if(!tags.length) return cb();
	// tag.findByNames(tags, function (err, status, msg, docs){
	// 	if(err) return cb(err);
	// 	/* start save */
	// 	var newArr = [];
	// 	for(var s in docs){ }
	// 	console.log(docs);
	// 	cb();
	// });
}

/**
 * 
 * @params
 * @return
 */
function procTags(info){
	var tags = info.Tags.split(',');
	info.Tags = [];
	for(var s in tags){
		if('' !== tags[s]) info.Tags.push(tags[s]);
	}
}

/**
 * 获取文章集合中的作者主键，过滤重复内容
 *
 * @params {Object} docs
 * @return {Array}
 */
function getUsersByArticles(docs){
	var user_ids = [];
	for(var i in docs){
		var article = docs[i];
		var user_id = article.User_Id.toString();
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
	if(!articles || 0 === articles.length) return cb(null, articles);
	var user_ids = getUsersByArticles(articles);

	User.find({
		_id: { '$in': user_ids }
	}, null, null, function (err, docs){
		if(err) return cb(err);
		for(var i in docs){
			var user = docs[i];

			for(var j in articles){
				var article = articles[j];
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
	var option = { sort: sort };

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
		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
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
		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, 0, null, docs);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.findListByCate = function(name, sort, page, user_id, cb){
	var option = { sort: sort };

	var params = {
		Cate: new RegExp('^'+ name +'$', 'i')
	};

	if(page){
		option.limit = page[0];
		// option.skip = ((page[0] - 1) * option.limit);
		if(!!page[1]){
			params._id = { '$lt': page[1] };
		}
	}

	Article.find(params, null, option, function (err, docs){
		if(err) return cb(err);
		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
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
		if(!doc) return cb(null, 3, 'Not Found.');
		// doc.ViewCount += 1;
		// doc.save();
		doc.update({
			ViewCount: doc.ViewCount + 1
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 0, null, doc);
		});
	});
};

/**
 * 
 * @params
 * @return
 */
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

/**
 * 
 * @params
 * @return
 */
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

/**
 * 
 * @params
 * @return
 */
exports.remove = function(id, user_id, cb){
	Article.remove({
		_id: id,
		User_Id: user_id
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 0, null, count);
	})
};