/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../settings');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

/**
 * 
 * @params
 * @return
 */
function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.padLeft(t.getMonth() + 1, '0', 2);
	var d = util.padLeft(t.getDate(), '0', 2);
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

/**
 * 
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('Archive', {
		moduleName: 'archive',
		title: '档案馆 | '+ title,
		description: '',
		keywords: ',档案馆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,asp,xhtml,html5',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};