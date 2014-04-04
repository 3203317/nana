var user = require('../controllers/user');
var role = require('../controllers/role');

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
};