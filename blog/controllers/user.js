var conf = require('../settings');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var User = require('../biz/user');

exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		title: title,
		atitle: '用户管理',
		description: '用户管理',
		keywords: ',用户管理,Bootstrap3',
		virtualPath: virtualPath,
		refererUrl: escape('http://'+ req.headers.host + req.url),
		cdn: conf.cdn
	});
};

exports.login = function(req, res, next){
	var result = { success: false },
		data = req._data;

	User.login(data, function (err, status, msg, doc){
		if(err) return next(err);
		if(1 !== status){
			result.msg = msg;
			return res.send(result);
		}
		req.session.userId = doc._id;
		req.session.role = 'user';
		req.session.user = doc;
		result.success = true;
		result.data = { id: doc._id };
		res.send(result);
	});
};

exports.login_success = function(req, res, next){
	var id = req.params.id.trim();
	res.redirect('/u/'+ id +'/admin');
};

exports.regUI = function(req, res, next){
	res.render('user/Register', {
		title: title,
		atitle: '新用户注册',
		description: '新用户注册',
		keywords: ',新用户注册,Bootstrap3',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.reg = function(req, res, next){
	var result = { success: false },
		data = req._data;

	User.register(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = 1 === status;
		result.msg = msg;
		res.send(result);
	});
};

exports.myUI = function(req, res, next){
	var user = req.session.user,
		_title = user.Email +'的个人空间';

	res.render('user/My', {
		title: title,
		atitle: _title,
		description: _title,
		keywords: ','+ _title +',Bootstrap3',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.validate = function(req, res, next){
	if('user' === req.session.role) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/user/login');
};