var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var User = require('../biz/user'),
	Category = require('../biz/category'),
	Article = require('../biz/article');

exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		title: title +' - 用户登陆',
		description: '用户登陆',
		keywords: ',用户登陆,Bootstrap3',
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
		if(!!status){
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
	var _user = req.flash('user')[0];
	res.redirect('/u/'+ _user.UserName +'/');
};

exports.regUI = function(req, res, next){
	res.render('user/Register', {
		title: title +' - 新用户注册',
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
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

exports.myUI = function(req, res, next){
	var name = req.params.name.trim(),
		_user = req.flash('user')[0],
		user = req.session.user,
		_title = _user.Nickname +'的个人空间 - '+ title;

	Article.findAll({
		_id: -1
	}, null, _user._id, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('user/My', {
			title: _title,
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
	var name = req.params.name.trim(),
		_user = req.flash('user')[0],
		user = req.session.user,
		_title = '发表博文 - '+ _user.Nickname +'的个人空间 - '+ title;

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('user/admin/NewBlog', {
			title: _title,
			description: _title,
			keywords: ','+ _title +',Bootstrap3',
			virtualPath: virtualPath,
			categorys: docs,
			cdn: conf.cdn
		});
	});
};

exports.editBlogUI = function(req, res, next){
	var aid = req.params.aid.trim(),
		name = req.params.name.trim(),
		_user = req.flash('user')[0],
		user = req.session.user,
		_title = '修改博文 - '+ _user.Nickname +'的个人空间 - '+ title;

	var ep = EventProxy.create('article', 'categorys', function (article, categorys){
		res.render('user/admin/EditBlog', {
			title: _title,
			description: _title,
			keywords: ','+ _title +',Bootstrap3',
			virtualPath: virtualPath,
			cdn: conf.cdn,
			article: article,
			categorys: categorys,
			frmUrl: aid
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Article.findById(aid, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return ep.emit('error', new Error('Not Found.'));
		ep.emit('article', doc);
	});

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs) return ep.emit('error', new Error('Not Found.'));
		ep.emit('categorys', docs);
	});
};

exports.editBlog = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;
	data.id = req.params.aid;

	Article.editInfo(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};

exports.saveNewBlog = function(req, res, next){
	var result = { success: false },
		data = req._data;

	data.User_Id = req.session.userId;

	Article.saveNew(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
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

exports.valiUserName = function(req, res, next){
	var name = req.params.name;

	User.findByName(name, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return next(new Error('Not Found User.'));
		req.flash('user', doc);
		next();
	});
};