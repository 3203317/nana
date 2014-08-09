var conf = require('../settings'),
	util = require('../lib/util');

var path = require('path'),
	cwd = process.cwd();

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Article = require('../biz/article');

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.name = function(req, res, next){
	var name = req.params.name;

	Article.findAllByCate(name, {
		Bookmark: -1,
		PostTime: -1
	}, [1, 10], null, function (err, status, msg, docs){
		if(err) return next(err);
		if(!docs || !docs.length) return res.redirect('/archive/');
		res.render('Category', {
			moduleName: 'category',
			title: name +' - 分类 - '+ title,
			description: name,
			keywords: ','+ name +',Bootstrap3',
			virtualPath: virtualPath,
			topMessage: getTopMessage(),
			cdn: conf.cdn,
			loadMore: 'archive/category/'+ name,
			articles: docs
		});
	});
};

exports.name_more = function(req, res, next){
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
		PostTime: -1
	}, [data.Current, 10], null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render(path.join(cwd, 'views', 'pagelet', 'ArticleIntros.vm.html'), {
			virtualPath: virtualPath,
			articles: docs
		});
	});
};