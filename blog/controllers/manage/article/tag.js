/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../../../settings');

var biz = {
	tag: require('../../../biz/tag')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.tag.getAll(function (err, docs){
		if(err) return next(err);
		res.render('manage/article/tag/Index', {
			conf: conf,
			title: '文章标签 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			data: {
				tags: docs
			}
		});
	});
};