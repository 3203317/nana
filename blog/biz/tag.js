/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var models = require('../models'),
	Tag = models.Tag;

/**
 * 获取所有
 *
 * @params
 * @return
 */
exports.getAll = function(cb){
	var option = {
		sort: { TagName: 1 }
	};

	Tag.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};