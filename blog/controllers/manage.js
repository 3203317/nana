/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventProxy = require('eventproxy');

var conf = require('../settings');

// biz
var Category = require('../biz/category'),
	Tag = require('../biz/tag');

/**
 * 
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('manage/Index', {
		conf: conf,
		title: '后台管理 | '+ conf.corp.name,
		description: '',
		keywords: ',Bootstrap3,nodejs,express'
	});
};

/**
 * 
 * @params
 * @return
 */
exports.article_category_indexUI = function(req, res, next){
	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/category/Index', {
			conf: conf,
			title: '文章分类 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			categorys: docs
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.article_tag_indexUI = function(req, res, next){
	Tag.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/tag/Index', {
			conf: conf,
			title: '文章标签 | 后台管理 | '+ conf.corp.name,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			tags: docs
		});
	});
};