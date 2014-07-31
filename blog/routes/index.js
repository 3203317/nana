var user = require('../controllers/user'),
	site = require('../controllers/site'),
	tag = require('../controllers/tag'),
	archive = require('../controllers/archive');

var virtualPath = '',
	title = 'FOREWORLD 洪荒',
	str1 = '参数异常';

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

module.exports = function(app){
	app.get('/install', site.installUI);

	app.post('/user/login', valiPostData, user.login);
	app.get('/user/login', user.loginUI);
	app.get('/user/:name/login/success', user.login_success);

	app.post('/user/register', valiPostData, user.reg);
	app.get('/user/register', user.regUI);

	app.get('/u/:name/', user.valiUserName, user.myUI);
	app.get('/u/:name/admin/new/blog', user.validate2, user.newBlogUI);
	app.post('/u/:name/admin/new/blog', valiPostData, user.validate, user.saveNewBlog);

	app.get('/archive/', archive.index);
	app.get('/archive/tag/', tag.index);
};