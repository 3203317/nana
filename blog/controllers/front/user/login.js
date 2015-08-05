/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy'),
	path = require('path'),
	cwd = process.cwd();

var conf = require('../../../settings');

var proxy = {
	link: require('../../../proxy/LINK'),
	comment: require('../../../proxy/COMMENT'),
	category: require('../../../proxy/CATEGORY'),
	article: require('../../../proxy/ARTICLE')
};

/**
 * 
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){

	proxy.category.getAll(function (err, docs){
		if(err) return next(err);
		var allCategorys = docs;

		res.render('front/user/Login', {
			conf: conf,
			title: '用户登陆 | '+ conf.corp.name,
			description: '',
			keywords: ',用户登陆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			refererUrl: escape(req.url),
			data: {
				allCategorys: allCategorys
			}
		});
	});
};