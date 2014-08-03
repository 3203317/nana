var conf = require('../settings'),
	util = require('../lib/util');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.index = function(req, res, next){
	res.render('Tags', {
		moduleName: 'tag',
		title: title +' - 标签',
		description: '标签',
		keywords: ',标签,Bootstrap3',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};