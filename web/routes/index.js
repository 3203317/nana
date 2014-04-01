var user = require('../controllers/user');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

module.exports = function(app) {

	/**
	 * 登陆及注册
	 *
	 * @method
	 * @params req
	 * @params res
	 * @return
	 */
	app.get('/user/login', user.login);
	app.get('/user/register', user.register);
};