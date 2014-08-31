var conf = require('../settings'),
	EventProxy = require('eventproxy'),
	util = require('../lib/util');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Article = require('../biz/article'),
	User = require('../biz/user');

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.idUI = function(req, res, next){
	Article.findById(req.params.id, function (err, status, msg, doc){
		if(err) return next(err);
		if(!doc) return res.redirect('/');

		var article = doc;
		var ep = EventProxy.create('prev', 'next', 'favs', 'author', function (prev, next, favs, author){
			article.author = author;
			res.render('Article', {
				moduleName: 'archive',
				title: article.Title +' - 档案馆 - '+ title,
				description: ','+ article.Title,
				keywords: ',个人博客,Blog'+ (article.Tags.length ? ','+ article.Tags : ''),
				virtualPath: virtualPath,
				topMessage: getTopMessage(),
				article: article,
				prev: prev,
				next: next,
				favs: favs,
				cdn: conf.cdn
			});
		});

		ep.fail(function (err){
			next(err);
		});

		User.findById(article.User_Id, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('author', doc);
		});

		Article.findNext(article, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('next', doc);
		});

		Article.findPrev(article, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('prev', doc);
		});

		Article.findFav(article, 3, function (err, status, msg, docs){
			if(err) return ep.emit('error', err);
			ep.emit('favs', docs);
		});
	});
};

exports.add = function(req, res, next){
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

exports.edit = function(req, res, next){
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

exports.remove = function(req, res, next){
	var result = { success: false },
		user = req.session.user,
		aid = req.params.aid;

	Article.remove(aid, user._id, function (err, status, msg, count){
		if(err) return next(err);
		result.success = !!count;
		res.send(result);
	});
};