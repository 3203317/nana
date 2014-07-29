var conf = require('../settings'),
	EventProxy = require('eventproxy'),
	util = require('../lib/util');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	velocity = require('velocityjs');

var Comment = require('../biz/comment'),
	Link = require('../biz/link'),
	Article = require('../biz/article'),
	Category = require('../biz/category');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.installUI = function(req, res, next){
	var vmPath = path.join(cwd, 'views', 'pagelet');

	var ep = EventProxy.create('topNavCategory', 'usefulLinks', 'top10Comments', 'top10ViewNums',
		function (topNavCategory, usefulLinks, top10Comments, top10ViewNums){
			res.send({
				success: true,
				data: arguments
			});
		}
	);

	ep.fail(function (err){
		next(err);
	});

	/* 热门文章前10 */
	Article.findByViewCount([1, 10], function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'Top10ViewNums.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				top10ViewNums: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'top10ViewNums.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('top10ViewNums', true);
			});
		});
	});

	/* 生成TOP分类 */
	Category.findCategorys(function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'TopNavCategory.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				topNavCategory: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'topNavCategory.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('topNavCategory', true);
			});
		});
	});

	/* 常用链接 */
	Link.findLinks(function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'UsefulLinks.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				usefulLinks: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'usefulLinks.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('usefulLinks', true);
			});
		});
	});

	/* 生成评论 */
	Comment.findComments([1, 10], function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'Top10Comments.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				top10Comments: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'top10Comments.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('top10Comments', true);
			});
		});
	});
};