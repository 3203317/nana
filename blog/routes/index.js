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
	archive: require('../controllers/front/archive'),
	tag: require('../controllers/front/tag'),
	tag_name: require('../controllers/front/tag_name'),
	article_id: require('../controllers/front/article_id'),
	category_name: require('../controllers/front/category_name'),
	user: {
		login: require('../controllers/front/user/login'),
		register: require('../controllers/front/user/register')
	}
};

var back = {
	my: require('../controllers/back/my')
};
var manage = {
	index: require('../controllers/manage/index'),
	manager: {
		login: require('../controllers/manage/manager/login'),
		logout: require('../controllers/manage/manager/logout'),
		changePwd: require('../controllers/manage/manager/changePwd')
	}, article: {
		category: require('../controllers/manage/article/category'),
		tag: require('../controllers/manage/article/tag')
	}
};

var str1 = '参数异常';

module.exports = function(app){
	/* front */
	app.get('/index.html$', front.index.indexUI);
	app.get('/index/more$', valiGetData, front.index.indexUI_more);
	app.get('/', front.index.indexUI);

	app.get('/install/comment1$', site.install_comment_1);
	app.get('/install/comment2$', site.install_comment_2);

	// archive
	app.get('/archive/', front.archive.indexUI);
	// tag
	app.get('/archive/tag/', front.tag.indexUI);
	// category_name
	app.get('/archive/category/:name/', front.category_name.indexUI);
	app.get('/archive/category/:name/more$', valiGetData, front.category_name.indexUI_more);
	// tag_name
	app.get('/archive/tag/:name/', front.tag_name.indexUI);
	app.get('/archive/tag/:name/more$', valiGetData, front.tag_name.indexUI_more);
	// article's id
	app.get('/archive/:id.html$', front.article_id.indexUI);

	// user login
	app.get('/user/login$', front.user.login.indexUI);
	app.post('/user/login$', valiPostData, front.user.login.login);
	app.get('/user/login/success$', front.user.login.validate, front.user.login.login_success);
	// register
	app.get('/user/register$', front.user.register.indexUI);
	app.post('/user/register$', valiPostData, front.user.register.register);

	/* back */
	app.get('/u/:name/', back.my.valiUserName, back.my.indexUI);

	/* manage */
	app.get('/manager/login$', manage.manager.login.indexUI);
	app.post('/manager/login$', valiPostData, manage.manager.login.login);
	app.get('/manager/logout$', manage.manager.login.validate, manage.manager.logout.indexUI);

	// changePwd
	app.get('/manager/changePwd$', manage.manager.login.validate, manage.manager.changePwd.indexUI);
	app.post('/manager/changePwd$', valiPostData, manage.manager.login.validate, manage.manager.changePwd.changePwd);

	// manager login
	app.get('/manage/', manage.manager.login.validate, manage.index.indexUI);

	// category
	app.get('/manage/article/category/', manage.manager.login.validate, manage.article.category.indexUI);
	// tag
	app.get('/manage/article/tag/', manage.manager.login.validate, manage.article.tag.indexUI);
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