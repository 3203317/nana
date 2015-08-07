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
	category_name: require('../controllers/front/category_name')
};

var back = {
	site: require('../controllers/back/site'),
	user: require('../controllers/back/user'),
	article: require('../controllers/back/article')
};

var manage = {
	site: require('../controllers/manage/site'),
	manager: require('../controllers/manage/manager'),
	article_category: require('../controllers/manage/article_category'),
	article_tag: require('../controllers/manage/article_tag')
};

var str1 = '参数异常';

module.exports = function(app){
	/* front */
	app.get('/index.html$', front.index.indexUI);
	app.get('/index/more$', valiGetData, front.index.indexUI_more);
	app.get('/', front.index.indexUI);

	app.get('/install/comment1$', back.user.login_validate, site.install_comment_1);
	app.get('/install/comment2$', back.user.login_validate, site.install_comment_2);

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

	/* back */
	app.get('/u/:name/', back.site.valiUserName, back.site.indexUI);

	// user login
	app.get('/user/login$', back.user.loginUI);
	app.post('/user/login$', valiPostData, back.user.login);
	app.get('/user/login/success$', back.user.login_validate, back.user.login_success);
	app.get('/user/logout$', back.user.logoutUI);
	// register
	app.get('/user/register$', back.user.registerUI);
	app.post('/user/register$', valiPostData, back.user.register);

	// create article
	app.get('/u/:name/admin/create/article$', back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.article.createUI);
	app.post('/u/:name/admin/create/article$', valiPostData, back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.article.create);
	// edit article
	app.get('/u/:name/admin/edit/article/:aid$', back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.article.editUI);
	app.post('/u/:name/admin/edit/article/:aid$', valiPostData, back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.article.edit);
	// remove article
	app.post('/u/:name/admin/remove/article/:aid$', back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.article.remove);

	// change pwd
	app.get('/u/:name/admin/changePwd/user$', back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.user.changePwdUI);
	app.post('/u/:name/admin/changePwd/user$', valiPostData, back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.user.changePwd);

	// edit user
	app.get('/u/:name/admin/edit/user$', back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.user.editUI);
	app.post('/u/:name/admin/edit/user$', valiPostData, back.user.login_validate, back.site.safeSkip, back.site.valiUserName, back.user.edit);

	/* manage */
	app.get('/manager/login$', manage.manager.loginUI);
	app.post('/manager/login$', valiPostData, manage.manager.login);
	app.get('/manager/logout$', manage.manager.logoutUI);

	// changePwd
	app.get('/manager/changePwd$', manage.manager.login_validate, manage.manager.changePwdUI);
	app.post('/manager/changePwd$', valiPostData, manage.manager.login_validate, manage.manager.changePwd);

	// manager login
	app.get('/manage/', manage.manager.login_validate, manage.site.indexUI);

	// category
	app.get('/manage/article/category/', manage.manager.login_validate, manage.article_category.indexUI);
	app.post('/manage/article/category/create$', valiPostData, manage.manager.login_validate, manage.article_category.create);
	app.post('/manage/article/category/remove$', valiPostData, manage.manager.login_validate, manage.article_category.remove);
	// tag
	app.get('/manage/article/tag/', manage.manager.login_validate, manage.article_tag.indexUI);
	app.post('/manage/article/tag/create$', valiPostData, manage.manager.login_validate, manage.article_tag.create);
	app.post('/manage/article/tag/remove$', valiPostData, manage.manager.login_validate, manage.article_tag.remove);
	app.get('/manage/article/tag/:id$', manage.manager.login_validate, manage.article_tag.id);
	app.post('/manage/article/tag/edit$', valiPostData, manage.manager.login_validate, manage.article_tag.edit);
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