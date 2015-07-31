/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Article = require('./article'),
	Tag = require('./tag');

var macros = require('../lib/macro');

/**
 * 标签馆
 *
 * @params
 * @return
 */
exports.tags = function(cb){

	Tag.findAll(null, function (err, status, msg, docs){
		if(err) return cb(err);

		/* 获取全部的标签 */
		var tags = docs;

		Article.findAll({
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