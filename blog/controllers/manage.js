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