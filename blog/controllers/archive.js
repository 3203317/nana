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

exports.indexUI = function(req, res, next){
	res.render('Archive', {
		moduleName: 'archive',
		title: '档案馆 - '+ title,
		description: '',
		keywords: ',档案馆,个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,asp,xhtml,html5',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		cdn: conf.cdn
	});
};