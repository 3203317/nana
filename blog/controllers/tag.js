'use strict';
var conf = require('../settings'),
	util = require('../lib/util');

var path = require('path'),
	cwd = process.cwd();

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Article = require('../biz/article'),
	Tag = require('../biz/tag');

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.indexUI = function(req, res, next){
	res.render('Tags', {
		moduleName: 'tag',
		title: '标签 - '+ title,
		description: '',
		keywords: ',标签,个人博客,Blog,Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};

exports.nameUI = function(req, res, next){
	var name = req.params.name;

	Article.findAllByTag(name, {
		Bookmark: -1,
		_id: -1
	}, [10], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.redirect('/archive/tag/');
		res.render('Tag', {
			moduleName: 'tag',
			title: name +' - 标签 - '+ title,
			description: '',
			keywords: ',标签,个人博客,Blog,'+ name,
			virtualPath: virtualPath,
			topMessage: getTopMessage(),
			cdn: conf.cdn,
			loadMore: 'archive/tag/'+ name,
			articles: docs
		});
	});
};

exports.nameUI_more = function(req, res, next){
	var data = req.query.data;
	if(!data) return res.send('');

	try{
		data = JSON.parse(data);
	}catch(ex){
		return res.send('');
	}

	if(!data.Current) return res.send('');

	Article.findAllByTag(req.params.name, {
		Bookmark: -1,
		_id: -1
	}, [10, data.Current], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.send('');
		res.render(path.join(cwd, 'views', 'pagelet', 'ArticleIntros.vm.html'), {
			virtualPath: virtualPath,
			articles: docs
		});
	});
};

exports.id = function(req, res, next){
	var result = { success: false },
		id = req.params.id;
	Tag.findById(id, function (err, status, msg, doc){
		if(err) return next(err);
		/* result */
		result.success = !status;
		result.data = doc;
		res.send(result);
	});
};

exports.edit = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Tag.editInfo(data, function (err, status, msg, count){
		if(err) return next(err);
		result.success = !status
		result.msg = msg;
		res.send(result);
	});
};

exports.removes = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Tag.remove(data.Ids, function (err, status, msg, count){
		if(err) return next(err);
		result.success = count === data.Ids.length;
		result.msg = msg;
		res.send(result);
	});
};

exports.add = function(req, res, next){
	var result = { success: false },
		data = req._data,
		user = req.session.user;
	data.User_Id = user._id;
	Tag.saveNew(data, function (err, status, msg, docs){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};