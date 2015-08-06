/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var conf = require('../../../settings');

var biz = {
	category: require('../../../biz/category')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.category.getAll(function (err, docs){
		if(err) return next(err);
		res.render('manage/article/category/Index', {
			conf: conf,
			title: '文章分类 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			data: {
				categorys: docs
			}
		});
	});
};