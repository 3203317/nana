var conf = require('../settings'),
	util = require('../lib/util');

var path = require('path'),
	cwd = process.cwd();

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Article = require('../biz/article'),
	Category = require('../biz/category');

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.nameUI = function(req, res, next){
	var name = req.params.name;

	Article.findAllByCate(name, {
		Bookmark: -1,
		_id: -1
	}, [10], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.redirect('/archive/');
		res.render('Category', {
			moduleName: 'category',
			title: name +' - 分类 - '+ title,
			description: ','+ name,
			keywords: ',个人博客,Blog,Bootstrap3,nodejs,express,'+ name,
			virtualPath: virtualPath,
			topMessage: getTopMessage(),
			cdn: conf.cdn,
			loadMore: 'archive/category/'+ name,
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

	Article.findAllByCate(req.params.name, {
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

exports.removes = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Category.remove(data.Ids, function (err, status, msg, count){
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
	Category.saveNew(data, function (err, status, msg, docs){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};