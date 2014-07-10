var conf = require('../settings');

var Manager = require('../biz/manager');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

/**
 *
 * @method 后台管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	Manager.getMenuTree(req.session.userId, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/Main', {
			title: title,
			atitle: '后台管理',
			description: '后台管理',
			keywords: ',后台管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			modules: docs
		});
	});
};

/**
 *
 * @method 后台管理欢迎页
 * @params 
 * @return 
 */
exports.welcomeUI = function(req, res, next) {
	res.render('Manage/Welcome', {
		title: title,
		atitle: '角色管理',
		description: '个人博客',
		keywords: ',角色管理,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.validate = function(req, res, next) {
	if('mgr' === req.session.role) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/mg/mgr/login');
};