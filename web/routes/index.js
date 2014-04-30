var user = require('../controllers/user');
var role = require('../controllers/role');
var device = require('../controllers/device');
var _module = require('../controllers/module');
var manage = require('../controllers/manage');
var manager = require('../controllers/manager');

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
	
	app.get('/my', user.validate, user.analyticsUI);
	
	app.get('/user/login', user.loginUI);
	app.post('/user/login.do', valiPostData, user.login);
	app.get('/user/register', user.registerUI);
	app.post('/user/register.do', valiPostData, user.register);
	app.get('/user/:name/fireRegEmail', user.fireRegEmailUI);

	app.get('/manage/user/index', manage.validate, user.indexUI);

	app.get('/manage/manager/login', manager.loginUI);
	app.post('/manage/manager/login.do', valiPostData, manager.login);
	app.get('/manage/manager/index', manage.validate, manager.indexUI);
	app.get('/manage/manager/logout', manage.validate, manager.logout);
	app.get('/manage/manager/:id.do', manage.validate, manager.getId);

	app.get('/manage/index', manage.validate, manage.indexUI);
	app.get('/manage/welcome', manage.validate, manage.welcomeUI);

	app.get('/manage/module/index', manage.validate, _module.indexUI);
	app.get('/manage/module/:id/children', manage.validate, _module.moduleListUI);
	app.post('/manage/module/add.do', manage.validate, valiPostData, _module.add);
	app.post('/manage/module/del.do', manage.validate, valiPostData, _module.del);
	app.post('/manage/module/edit.do', manage.validate, valiPostData, _module.edit);
	app.get('/manage/module/:id.do', manage.validate, _module.getId);

	app.get('/manage/role/index', manage.validate, role.indexUI);
	app.post('/manage/role/add.do', manage.validate, valiPostData, role.add);
	app.post('/manage/role/del.do', manage.validate, valiPostData, role.del);
	app.post('/manage/role/edit.do', manage.validate, valiPostData, role.edit);
	app.get('/manage/role/:id.do', manage.validate, role.getId);

	app.get('/manage/device/index', manage.validate, device.indexUI);
	
	app.get('/manage/devicelog/index', manage.validate, device.logUI);
};