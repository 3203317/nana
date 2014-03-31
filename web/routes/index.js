var user = require('../controllers/user');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

module.exports = function(app) {

	/**
	 * 登陆
	 *
	 * @method
	 * @params req
	 * @params res
	 * @return
	 */
	app.get('/user/login', user.login);
};