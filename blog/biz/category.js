/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Category = models.Category;

/**
 * 获取所有分类
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	var option = {
		sort: { Sort: 1 }
	};

	Category.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};