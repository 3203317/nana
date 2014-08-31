var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Category = require('../biz/category'),
	Tag = require('../biz/tag');

exports.indexUI = function(req, res, next){
	res.render('manage/Index', {
		title: '后台管理 - '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.article_category_indexUI = function(req, res, next){
	Category.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/category/Index', {
			title: '文章分类 - 后台管理 - '+ title,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			virtualPath: virtualPath,
			categorys: docs,
			cdn: conf.cdn
		});
	});
};

/**
 *
 * @params
 * @params
 * @params
 * @return
 */
exports.article_tag_indexUI = function(req, res, next){
	Tag.findAll(null, function (err, status, msg, docs){
		if(err) return next(err);
		res.render('manage/article/tag/Index', {
			title: '文章标签 - 后台管理 - '+ title,
			description: '',
			keywords: ',Bootstrap3,nodejs,express',
			virtualPath: virtualPath,
			tags: docs,
			cdn: conf.cdn
		});
	});
};