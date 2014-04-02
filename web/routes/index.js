var user = require('../controllers/user');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

module.exports = function(app) {

	app.use(function (req, res) {
		if(req.accepts('html')){
			res.render('404', {
				state: 404,
				url: req.url,
				title: title,
				atitle: '404',
				description: '个人博客',
				keywords: ',个人博客,Bootstrap3',
				virtualPath: virtualPath +'/'
			});
			return;
		}
		if(req.accepts('json')){
			res.send({
				success: false,
				msg: 'Not found'
			});
			return;
		}
		res.type('txt').send('Not found');
	});

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
	app.post('/user/login.do', user.login);
	app.post('/user/register.do', user.register);
};