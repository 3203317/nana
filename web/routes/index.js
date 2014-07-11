var log = require('log4js').getLogger("index");

var user = require('../controllers/user'),
	mgr = require('../controllers/manager'),
	mg = require('../controllers/manage'),
	site = require('../controllers/site');/*,
	role = require('../controllers/role'),
	device = require('../controllers/device'),
	_module = require('../controllers/module'),
	*/

var virtualPath = '',
	title = 'FOREWORLD 洪荒',
	str1 = '参数异常';

log.info('router');

module.exports = function(app) {

	// app.all('*', function (req, res, next) {
	// 	res.header('Access-Control-Allow-Origin', '*');
	// 	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	// 	next();
	// });

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

	app.get('/install', site.installUI);
	
	// app.get('/my', user.validate, user.analyticsUI);

	app.get('/user/login', user.loginUI);
	app.post('/user/login', valiPostData, user.login);

	app.get('/user/register', user.registerUI);
	app.post('/user/register', valiPostData, user.register);
	app.get('/user/:email/register/success', user.register_success);
	
	// app.get('/user/:email/register/activate', user.register_activateUI);
	// app.post('/user/:email/register/activate', user.register_activate);
	// app.get('/user/:email/register/activate/success', user.register_activate_successUI);
	// app.get('/user/:email/register/activate/failure', user.register_activate_failureUI);

	app.get('/user/:email/register/sendEmail', user.sendRegEmail);
	app.get('/user/:email/register/sendEmail/success', user.sendRegEmail_successUI);

	app.get('/user/:email/register/resendEmail', user.resendRegEmailUI);
	app.post('/user/:email/register/resendEmail', valiPostData, user.resendRegEmail);
	app.get('/user/:email/register/resendEmail/success', user.resendRegEmail_successUI);

	app.get('/user/:email/ackRegEmail/:code', user.ackRegEmailUI);

	// app.get('/manage/user/index', manage.validate, user.indexUI);

	app.get('/mg/mgr/login', mgr.loginUI);
	app.post('/mg/mgr/login', valiPostData, mgr.login);

	// app.get('/manage/manager/index', manage.validate, mgr.indexUI);
	// app.get('/manage/manager/logout', manage.validate, mgr.logout);
	// app.get('/manage/manager/:id', manage.validate, mgr.getId);

	app.get('/mg/index', mg.validate, mg.indexUI);
	// app.get('/manage/welcome', manage.validate, manage.welcomeUI);

	// app.get('/manage/module/index', manage.validate, _module.indexUI);
	// app.get('/manage/module/:id/children', manage.validate, _module.moduleListUI);
	// app.post('/manage/module/add', manage.validate, valiPostData, _module.add);
	// app.post('/manage/module/del', manage.validate, valiPostData, _module.del);
	// app.post('/manage/module/edit', manage.validate, valiPostData, _module.edit);
	// app.get('/manage/module/:id', manage.validate, _module.getId);

	// app.get('/manage/role/index', manage.validate, role.indexUI);
	// app.post('/manage/role/add', manage.validate, valiPostData, role.add);
	// app.post('/manage/role/del', manage.validate, valiPostData, role.del);
	// app.post('/manage/role/edit', manage.validate, valiPostData, role.edit);
	// app.get('/manage/role/:id', manage.validate, role.getId);

	// app.get('/manage/device/index', manage.validate, device.indexUI);
	
	// app.get('/manage/devicelog/index', manage.validate, device.logUI);
};