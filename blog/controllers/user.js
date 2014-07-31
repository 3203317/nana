var conf = require('../settings');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var User = require('../biz/user'),
	Article = require('../biz/article');

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
		result.data = { UserName: doc.UserName };
		res.send(result);
	});
};

exports.login_success = function(req, res, next){
	var name = req.params.name.trim();
	res.redirect('/u/'+ name +'/');
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
	var name = req.params.name.trim(),
		_user = req.flash('user')[0],
		user = req.session.user,
		_title = name +'的个人空间';

	Article.findAll(_user._id, function (err, status, msg, docs){
		if(err) return next(err);

		res.render('user/My', {
			title: title,
			atitle: _title,
			description: _title,
			keywords: ','+ _title +',Bootstrap3',
			virtualPath: virtualPath,
			cdn: conf.cdn,
			_user: _user,
			user: user,
			articles: docs
		});
	});
};

exports.newBlogUI = function(req, res, next){
	var user = req.session.user,
		_title = '的个人空间';

	res.render('user/admin/NewBlog', {
		title: title,
		atitle: _title,
		description: _title,
		keywords: ','+ _title +',Bootstrap3',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.editBlogUI = function(req, res, next){
	var user = req.session.user,
		_title = '的个人空间';

	res.render('user/admin/EditBlog', {
		title: title,
		atitle: _title,
		description: _title,
		keywords: ','+ _title +',Bootstrap3',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.saveNewBlog = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;

	Article.saveNew(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = true;
		res.send(result);
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

exports.validate2 = function(req, res, next){
	if('user' === req.session.role) return next();
	var name = req.params.name.trim();
	res.redirect('/u/'+ name +'/');
};

exports.valiUserName = function(req, res, next){
	var name = req.params.name.trim();

	User.findByName(name, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return next(new Error('Not Found User.'));
		req.flash('user', doc);
		next();
	});
};