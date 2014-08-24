var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var User = require('../biz/user'),
	Link = require('../biz/link'),
	Category = require('../biz/category'),
	Comment = require('../biz/comment'),
	Article = require('../biz/article');

exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		title: '用户登陆 - '+ title,
		description: '',
		keywords: ',用户登陆,Bootstrap3,nodejs,express',
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
	res.redirect('/u/'+ req.params.name +'/');
};

exports.regUI = function(req, res, next){
	res.render('user/Register', {
		title: '新用户注册 - '+ title,
		description: '',
		keywords: ',新用户注册,Bootstrap3,nodejs,express',
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
	var _user = req.flash('user')[0],
		user = req.session.user;

	var ep = EventProxy.create('articles', 'hot10', 'links', 'newCmt', function (articles, hot10, links, newCmt){
		res.render('user/My', {
			title: _user.Nickname +'的个人空间 - '+ title,
			description: '',
			keywords: ',Bootstrap3,nodejs,express,'+ _user.Nickname +'的个人空间',
			virtualPath: virtualPath,
			cdn: conf.cdn,
			_user: _user,
			user: user,
			links: links,
			hot10: hot10,
			newCmt: newCmt,
			articles: articles
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Comment.findAll([5], null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
		ep.emit('newCmt', docs);
	});

	Link.findAll(_user._id, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
		ep.emit('links', docs);
	});

	Article.findAll({
		_id: -1
	}, null, _user._id, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
		ep.emit('articles', docs);
	});

	Article.findAll({
		ViewCount: -1
	}, [10], _user._id, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
		ep.emit('hot10', docs);
	});
};

exports.newBlogUI = function(req, res, next){
	var _user = req.flash('user')[0];

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('user/admin/NewBlog', {
			title: '发表博文 - '+ _user.Nickname +'的个人空间 - '+ title,
			description: '',
			keywords: ',发表博文,Bootstrap3,nodejs,express,'+ _user.Nickname +'的个人空间',
			virtualPath: virtualPath,
			categorys: docs,
			frmUrl: 'blog',
			cdn: conf.cdn
		});
	});
};

exports.editBlogUI = function(req, res, next){
	var aid = req.params.aid.trim(),
		_user = req.flash('user')[0];

	var ep = EventProxy.create('article', 'categorys', function (article, categorys){
		res.render('user/admin/EditBlog', {
			title: '修改博文 - '+ _user.Nickname +'的个人空间 - '+ title,
			description: '',
			keywords: ',修改博文,Bootstrap3,nodejs,express,'+ _user.Nickname +'的个人空间',
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
		if(err) return ep.emit('error', err);
		if(!doc) return ep.emit('error', new Error('Not Found.'));
		if(doc.User_Id.toString() !== _user._id.toString()) return ep.emit('error', new Error('Not Permit.'));
		ep.emit('article', doc);
	});

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
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

exports.delBlog = function(req, res, next){
	var result = { success: false },
		user = req.session.user,
		aid = req.params.aid.trim();

	Article.remove(aid, user._id, function (err, status, msg, count){
		if(err) return next(err);
		result.success = !!count;
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

exports.safeSkip = function(req, res, next){
	var name = req.params.name,
		user = req.session.user;
	if(name === user.UserName) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/u/'+ user.UserName +'/');
};

exports.changePWUI = function(req, res, next){
	var _user = req.flash('user')[0];

	res.render('user/admin/ChangePW', {
		title: '修改登录密码 - '+ _user.Nickname +'的个人空间 - '+ title,
		description: '',
		keywords: ',修改登录密码,Bootstrap3,nodejs,express,'+ _user.Nickname +'的个人空间',
		virtualPath: virtualPath,
		frmUrl: 'pw',
		cdn: conf.cdn
	});
};

exports.changePW = function(req, res, next){
	var result = { success: false },
		data = req._data;
	var user = req.session.user;

	if(!data.NewPass || !data.NewPass.trim().length){
		result.msg = ['新密码不能为空。', 'NewPass'];
		return res.send(result);
	}

	User.changePwd(user._id, data.OldPass, data.NewPass, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};