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
	res.render('Archive', {
		moduleName: 'archive',
		title: title,
		atitle: '档案馆',
		description: '档案馆',
		keywords: ',档案馆,Bootstrap3',
		virtualPath: '..'+ virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};