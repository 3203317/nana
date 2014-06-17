var user = require('../controllers/user'),
	role = require('../controllers/role'),
	device = require('../controllers/device'),
	_module = require('../controllers/module'),
	manage = require('../controllers/manage'),
	manager = require('../controllers/manager');

var virtualPath = '',
	title = 'FOREWORLD 洪荒',
	str1 = '参数异常';

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
	app.post('/user/register', valiPostData, user.register);
	app.get('/user/:email/register/success', user.register_success);

	app.get('/user/:email/register/sendEmail', user.sendRegEmail);
	app.get('/user/:email/register/sendEmail/success', user.sendRegEmail_successUI);

	app.get('/user/:email/ackRegEmail/:code', user.ackRegEmailUI);

	app.get('/manage/user/index', manage.validate, user.indexUI);

	app.get('/manage/manager/login', manager.loginUI);
	app.post('/manage/manager/login', valiPostData, manager.login);

	app.get('/manage/manager/index', manage.validate, manager.indexUI);
	app.get('/manage/manager/logout', manage.validate, manager.logout);
	app.get('/manage/manager/:id', manage.validate, manager.getId);

	app.get('/manage/index', manage.validate, manage.indexUI);
	app.get('/manage/welcome', manage.validate, manage.welcomeUI);

	app.get('/manage/module/index', manage.validate, _module.indexUI);
	app.get('/manage/module/:id/children', manage.validate, _module.moduleListUI);
	app.post('/manage/module/add', manage.validate, valiPostData, _module.add);
	app.post('/manage/module/del', manage.validate, valiPostData, _module.del);
	app.post('/manage/module/edit', manage.validate, valiPostData, _module.edit);
	app.get('/manage/module/:id', manage.validate, _module.getId);

	app.get('/manage/role/index', manage.validate, role.indexUI);
	app.post('/manage/role/add', manage.validate, valiPostData, role.add);
	app.post('/manage/role/del', manage.validate, valiPostData, role.del);
	app.post('/manage/role/edit', manage.validate, valiPostData, role.edit);
	app.get('/manage/role/:id', manage.validate, role.getId);

	app.get('/manage/device/index', manage.validate, device.indexUI);
	
	app.get('/manage/devicelog/index', manage.validate, device.logUI);
};