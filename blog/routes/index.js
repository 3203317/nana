var user = require('../controllers/user'),
	site = require('../controllers/site'),
	tag = require('../controllers/tag'),
	category = require('../controllers/category'),
	article = require('../controllers/article'),
	manager = require('../controllers/manager'),
	manage = require('../controllers/manage'),
	archive = require('../controllers/archive');

var virtualPath = '',
	title = 'FOREWORLD 洪荒',
	str1 = '参数异常';

module.exports = function(app){
	app.get('/index.html$', site.indexUI);
	app.get('/index/more$', site.indexUI_more);
	app.get('/', site.indexUI);
	app.get('/install$', user.validate, site.installUI);
	app.get('/install/comment$', user.validate, site.commentUI);

	app.post('/user/login$', valiPostData, user.login);
	app.get('/user/login$', user.loginUI);
	app.get('/user/login/success$', user.validate, user.login_success);

	app.post('/user/register$', valiPostData, user.reg);
	app.get('/user/register$', user.regUI);

	app.get('/u/:name/', user.valiUserName, user.myUI);
	app.get('/u/:name/admin/new/blog$', user.validate, user.safeSkip, user.valiUserName, user.newBlogUI);
	app.post('/u/:name/admin/new/blog$', valiPostData, user.validate, user.safeSkip, user.valiUserName, article.add);

	app.get('/u/:name/admin/edit/blog/:aid$', user.validate, user.safeSkip, user.valiUserName, user.editBlogUI);
	app.post('/u/:name/admin/edit/blog/:aid$', valiPostData, user.validate, user.safeSkip, user.valiUserName, article.edit);

	app.post('/u/:name/admin/del/blog/:aid$', user.validate, user.safeSkip, user.valiUserName, article.remove);

	app.get('/u/:name/admin/edit/pw$', user.validate, user.safeSkip, user.valiUserName, user.changePwdUI);
	app.post('/u/:name/admin/edit/pw$', valiPostData, user.validate, user.safeSkip, user.valiUserName, user.changePwd);

	app.get('/archive/', archive.indexUI);
	app.get('/archive/tag/', tag.indexUI);
	app.get('/archive/tag/:name/', tag.nameUI);
	app.get('/archive/tag/:name/more$', tag.nameUI_more);

	app.get('/archive/category/:name/', category.nameUI);
	app.get('/archive/category/:name/more$', category.nameUI_more);

	app.get('/archive/:id.html$', article.idUI);

	// manage
	app.get('/manager/logout$', manager.validate, manager.logout);
	app.get('/manager/login$', manager.loginUI);
	app.post('/manager/login$', valiPostData, manager.login);
	app.get('/manager/changePwd$', manager.validate, manager.changePwdUI);
	app.post('/manager/changePwd$', valiPostData, manager.validate, manager.changePwd);

	app.get('/manage/', manager.validate, manage.indexUI);
	app.get('/manage/article/category/', manager.validate, manage.article_category_indexUI);
	app.post('/manage/article/category/add$', valiPostData, manager.validate, category.add);
	app.post('/manage/article/category/del$', valiPostData, manager.validate, category.removes);

	app.get('/manage/article/tag/', manager.validate, manage.article_tag_indexUI);
	app.get('/manage/article/tag/:id$', manager.validate, tag.id);
	app.post('/manage/article/tag/add$', valiPostData, manager.validate, tag.add);
	app.post('/manage/article/tag/del$', valiPostData, manager.validate, tag.removes);
	app.post('/manage/article/tag/edit$', valiPostData, manager.validate, tag.edit);
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
	if(!data) return res.send({
		success: false,
		msg: str1
	});

	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		res.send({
			success: false,
			msg: str1
		});
	}catch(ex){
		res.send({
			success: false,
			msg: ex.message
		});
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