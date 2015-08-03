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
 * 获取文章列表
 *
 * @params
 * @return
 */
exports.findList = function(curPage, pageSize, user_id, cb){
	curPage = curPage || 1;
	pageSize = pageSize || 10;
	var option = {
		limit: pageSize,
		skip: (curPage - 1) * pageSize,
		sort: {
			Topmark: -1,
			_id: -1
		}
	};

	var params = null;
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
 * topmarks
 *
 * @params
 * @return
 */
exports.findBookmarkTopN = function(num, cb){
	Article.find({
		Bookmark: 1
	}, null, {
		limit: num || 5,
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
exports.findHotTopN = function(num, cb){
	var option = {
		limit: num || 10,
		sort: { ViewCount: -1 }
	};

	Article.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		attachData(docs, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	});
};

/**
 * 查询所有文章
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	var option = {
		sort: { _id: -1 }
	};

	Article.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

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