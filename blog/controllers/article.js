var conf = require('../settings'),
	EventProxy = require('eventproxy'),
	util = require('../lib/util');

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

exports.id = function(req, res, next){
	var id = req.params.id.trim();

	var ep = EventProxy.create('article', 'prev', 'next', 'favs', function (article, prev, next, favs){
		res.render('Article', {
			moduleName: 'archive',
			title: article.Title +' - 档案馆 - '+ title,
			description: article.Title,
			keywords: ','+ article.Title +',Bootstrap3',
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

	Article.findById(id, function (err, status, msg, doc){
		if(err) return ep.emit('error', err);
		if(!doc) return ep.emit('error', new Error('Not Found.'));
		ep.emit('article', doc);

		Article.findNext(doc, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('next', doc);
		});

		Article.findPrev(doc, function (err, status, msg, doc){
			if(err) return ep.emit('error', err);
			ep.emit('prev', doc);
		});

		Article.findFav(doc, 3, function (err, status, msg, docs){
			if(err) return ep.emit('error', err);
			ep.emit('favs', docs);
		});
	});
};