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

		res.render('front/user/Register', {
			conf: conf,
			title: '新用户注册 | '+ conf.corp.name,
			description: '',
			keywords: ',新用户注册,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
			data: {
				allCategorys: allCategorys
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.register = function(req, res, next){
	var result = { success: false },
		data = req._data;

	result.success = !1;
	result.msg = ['暂停用户注册', 'Email'];
	res.send(result);
};