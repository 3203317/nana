var conf = require('../settings');
var util = require('../libs/utils');
var User = require('../modules/User.js');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

/**
 *
 * @method 后台管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	User.getMenuTree('abc', function(err, docs){
		if(err) return next(err);
		res.render('Manage/Main', {
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
	if(1 === req.session.lv) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/manage/user/login');
};