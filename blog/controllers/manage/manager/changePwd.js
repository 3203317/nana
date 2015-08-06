/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../../settings');

var biz = {
	manager: require('../../../biz/manager')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('manage/manager/changePwd', {
		conf: conf,
		title: '修改密码 | 后台管理 | '+ conf.corp.name,
		description: '',
		keywords: ',个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5'
	});
};

/**
 *
 * @params
 * @return
 */
exports.changePwd = function(req, res, next){
	// TODO
};