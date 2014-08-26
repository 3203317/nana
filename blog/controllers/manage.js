var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.indexUI = function(req, res, next){
	res.render('manage/Index', {
		title: '后台管理 - '+ title,
		description: '',
		keywords: ',后台管理,Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.article_category_indexUI = function(req, res, next){
	res.render('manage/article/category/Index', {
		title: '文章分类 - 后台管理 - '+ title,
		description: '',
		keywords: ',文章分类,后台管理,Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};