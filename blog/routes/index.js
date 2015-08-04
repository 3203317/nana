/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var site = require('../controllers/site')

// controller
var front = {
	index: require('../controllers/front/index'),
	archive: require('../controllers/front/archive')
};

var back = {};
var manage = {};

var str1 = '参数异常';

module.exports = function(app){
	// front
	app.get('/index.html$', front.index.indexUI);
	app.get('/index/more$', front.index.indexUI_more);
	app.get('/', front.index.indexUI);

	app.get('/install/comment1$', site.install_comment_1);
	app.get('/install/comment2$', site.install_comment_2);

	// archive
	app.get('/archive/', front.archive.indexUI);
};

/**
 * post数据校验
 *
 * @params {Object}
 * @params {Object}
 * @return {Object}
 */
function valiPostData(req, res, next){
	var data = req.body.data;
	if(!data) return res.send({ success: false, msg: str1 });

	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		res.send({ success: false, msg: str1 });
	}catch(ex){
		res.send({ success: false, msg: ex.message });
	}
}

/**
 * get数据校验
 *
 * @params {Object}
 * @params {Object}
 * @return {Object}
 */
function valiGetData(req, res, next){
	var data = req.query.data;
	if(!data) return next(new Error(str1));
	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		next(new Error(str1));
	}catch(ex){
		next(new Error(ex.message));
	}
}