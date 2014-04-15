var user = require('../controllers/user');
var role = require('../controllers/role');
var device = require('../controllers/device');
var _module = require('../controllers/module');
var manage = require('../controllers/manage');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

var str1 = '参数异常';

module.exports = function(app) {

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
	
	app.get('/my', user.analyticsUI);

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
	app.post('/manage/user/login.do', valiPostData, user.loginBackStage);
	app.get('/manage', manage.validate);
	app.post('/manage', manage.validate);
	app.get('/manage/index', manage.indexUI);
	app.get('/manage/welcome', manage.welcomeUI);

	app.get('/manage/user/index', user.indexUI);
	app.get('/manage/module/index', _module.indexUI);
	app.get('/manage/role/index', role.indexUI);
	app.get('/manage/device/index', device.indexUI);
	app.get('/manage/devicelog/index', device.logUI);
};