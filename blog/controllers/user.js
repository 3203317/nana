/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventProxy = require('eventproxy');

var conf = require('../settings');

// biz
var User = require('../biz/user'),
	Link = require('../biz/link'),
	Category = require('../biz/category'),
	Comment = require('../biz/comment'),
	Article = require('../biz/article');

/**
 * 
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		conf: conf,
		title: '用户登陆 | '+ conf.corp.name,
		description: '',
		keywords: ',用户登陆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5',
		//refererUrl: escape('http://'+ req.headers.host + req.url),
		refererUrl: escape(req.url)
	});
};

/**
 * 
 * @params
 * @return
 */
exports.login = function(req, res, next){
	var result = { success: false },
		data = req._data;

	User.login(data, function (err, status, msg, doc){
		if(err) return next(err);
		if(!!status){
			result.msg = msg;
			return res.send(result);
		}
		/* session */
		req.session.lv = 2;
		req.session.userId = doc._id;
		req.session.role = 'user';
		req.session.user = doc;
		/* result */
		result.success = true;
		res.send(result);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.login_success = function(req, res, next){
	var user = req.session.user;
	res.redirect('/u/'+ user.UserName +'/');
};

/**
 * 
 * @params
 * @return
 */
exports.regUI = function(req, res, next){
	res.render('user/Register', {
		conf: conf,
		title: '新用户注册 | '+ conf.corp.name,
		description: '',
		keywords: ',新用户注册,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,aspx,html5'
	});
};

/**
 * 
 * @params
 * @return
 */
exports.reg = function(req, res, next){
	var result = { success: false },
		data = req._data;

	result.success = !1;
	result.msg = ['暂停用户注册', 'Email'];
	res.send(result);

	// User.register(data, function (err, status, msg, doc){
	// 	if(err) return next(err);
	// 	result.success = !status;
	// 	result.msg = msg;
	// 	res.send(result);
	// });
};

/**
 * 
 * @params
 * @return
 */
exports.myUI = function(req, res, next){
	var _user = req.flash('user')[0],
		user = req.session.user;

	var ep = EventProxy.create('articles', 'hot10', 'links', 'newCmt', function (articles, hot10, links, newCmt){
		res.render('user/My', {
			title: _user.Nickname +'的个人空间 | '+ title,
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

/**
 * 
 * @params
 * @return
 */
exports.newBlogUI = function(req, res, next){
	var user = req.session.user;

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('user/admin/NewBlog', {
			title: '发表博文 | '+ user.Nickname +'的个人空间 | '+ title,
			description: '',
			keywords: ',发表博文,Bootstrap3,nodejs,express,'+ user.Nickname +'的个人空间',
			virtualPath: virtualPath,
			categorys: docs,
			frmUrl: 'blog',
			cdn: conf.cdn
		});
	});
};

/**
 * 
 * @params
 * @return
 */
exports.editBlogUI = function(req, res, next){
	var aid = req.params.aid,
		user = req.session.user;

	var ep = EventProxy.create('article', 'categorys', function (article, categorys){
		res.render('user/admin/EditBlog', {
			title: '修改博文 | '+ user.Nickname +'的个人空间 | '+ title,
			description: '',
			keywords: ',修改博文,Bootstrap3,nodejs,express,'+ user.Nickname +'的个人空间',
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
		if(doc.User_Id.toString() !== user._id.toString())
			return ep.emit('error', new Error('Not Permit.'));
		ep.emit('article', doc);
	});

	Category.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);
		ep.emit('categorys', docs);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.validate = function(req, res, next){
	if(2 === req.session.lv) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/user/login');
};

/**
 * 
 * @params
 * @return
 */
exports.valiUserName = function(req, res, next){
	var name = req.params.name,
		user = req.session.user;

	if(!!user && name === user.UserName){
		req.flash('user', user);
		return next();
	}

	User.findByName(name, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return next(new Error('Not Found User.'));
		req.flash('user', doc);
		next();
	});
};

/**
 * 
 * @params
 * @return
 */
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

/**
 * 
 * @params
 * @return
 */
exports.changePwdUI = function(req, res, next){
	var user = req.session.user;

	res.render('user/admin/ChangePwd', {
		title: '修改登录密码 | '+ user.Nickname +'的个人空间 | '+ title,
		description: '',
		keywords: ',修改登录密码,Bootstrap3,nodejs,express,'+ user.Nickname +'的个人空间',
		virtualPath: virtualPath,
		frmUrl: 'pw',
		cdn: conf.cdn
	});
};

/**
 * 
 * @params
 * @return
 */
exports.changePwd = function(req, res, next){
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
