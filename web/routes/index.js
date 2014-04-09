var user = require('../controllers/user');
var role = require('../controllers/role');
var _module = require('../controllers/module');
var manage = require('../controllers/manage');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

module.exports = function(app) {

	function valiPostData(req, res, next){
		try{
			var data = eval('('+ req.body.data +')');
			req._data = data;
			next();
		}catch(ex){
			return res.send({
				success: false,
				msg: ex.message
			});
		}
	}

	/**
	 * 登陆及注册
	 *
	 * @method
	 * @params req
	 * @params res
	 * @return
	 */
	app.get('/user/login', user.loginUI);
	app.get('/user/register', user.registerUI);
	app.post('/user/login.do', valiPostData, user.login);
	app.post('/user/register.do', valiPostData, user.register);

	app.get('/role/index', role.indexUI);
	app.post('/role/saveNew.do', valiPostData, role.saveNew);

	app.get('/manage/user/login', user.loginBackStageUI);
	app.get('/manage', manage.validate);
	app.post('/manage', manage.validate);
	app.get('/manage/index', manage.indexUI);
	app.get('/manage/welcome', manage.welcomeUI);

	app.get('/manage/user/index', user.indexUI);
	app.get('/manage/module/index', _module.indexUI);
	app.get('/manage/role/index', role.indexUI);
};