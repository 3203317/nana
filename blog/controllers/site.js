var conf = require('../settings'),
	util = require('../lib/util');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	velocity = require('velocityjs');

var Comment = require('../biz/comment'),
	Link = require('../biz/link');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.installUI = function(req, res, next){
	var vmPath = path.join(cwd, 'views', 'pagelet');

	Link.install(function (err, status, msg, doc){
		if(err) return next(err);
	});

	/* 评论 */
	Comment.install(function (err, status, msg, doc){
		if(err) return next(err);

		/* 生成右侧sider */
		Comment.findComments([1, 10], function (err, status, msg, docs){
			if(err) return next(err);

			fs.readFile(path.join(vmPath, 'Top10Comments.vm.html'), 'utf8', function (err, template){
				if(err) return next(err);

				var html = velocity.render(template, {
					virtualPath: virtualPath,
					top10Comments: docs
				});

				fs.writeFile(path.join(vmPath, 'html', 'top10Comments.html'), html, 'utf8', function (err){
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