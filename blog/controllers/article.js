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

	var ep = EventProxy.create('article', function (article){
		res.render('Article', {
			moduleName: 'archive',
			title: article.Title +' - '+ title,
			description: article.Title,
			keywords: ','+ article.Title +',Bootstrap3',
			virtualPath: virtualPath,
			topMessage: getTopMessage(),
			article: article,
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
	});
};