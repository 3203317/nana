var conf = require('../settings'),
	util = require('../lib/util');

var Comment = require('../biz/comment');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.installUI = function(req, res, next){

	/* 评论 */
	Comment.install(function (err, status, msg, doc){
		if(err) return next(err);
		res.send({
			success: 1 === status,
			msg: msg,
			data: doc
		});
	});
};