var conf = require('../settings'),
	util = require('../lib/util');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

function getTopMessage(){
	var time = new Date();
	var year = time.getFullYear();
	var month = util.pdate(time.getMonth() + 1);
	var day = util.pdate(time.getDate());
	return '欢迎您。今天是'+ year +'年'+ month +'月'+ day +'日。';
};

exports.index = function(req, res, next){
	res.render('Tags', {
		moduleName: 'tag',
		title: title,
		atitle: '标签',
		description: '标签',
		keywords: ',标签,Bootstrap3',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};