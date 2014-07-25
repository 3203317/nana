var conf = require('../settings'),
	util = require('../lib/util');

var fs = require('fs'),
	cwd = process.cwd(),
	velocity = require('velocityjs');

var Comment = require('../biz/comment');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.installUI = function(req, res, next){
	var path = '/views/pagelet/';

	/* 评论 */
	Comment.install(function (err, status, msg, doc){
		if(err) return next(err);

		/* 生成右侧sider */
		Comment.findComments([1, 10], function (err, status, msg, docs){
			if(err) return next(err);

			fs.readFile(cwd + path +'Top10Comments.vm.html', 'utf8', function (err, template){
				if(err) return next(err);

				var html = velocity.render(template, {
					virtualPath: virtualPath,
					top10Comments: docs
				});

				fs.writeFile(cwd + path +'html/top10Comments.html', html, 'utf8', function (err){
					if(err) console.log(err);
				});
			});
		});

		res.send({
			success: 0 === status,
			msg: msg,
			data: doc
		});
	});
};