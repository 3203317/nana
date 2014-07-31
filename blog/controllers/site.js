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
	Tag = require('../biz/tag'),
	Category = require('../biz/category');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.installUI = function(req, res, next){
	var vmPath = path.join(cwd, 'views', 'pagelet');

	var ep = EventProxy.create('topNavCategory', 'usefulLinks', 'top10Comments', 'top10ViewNums', 'archiveList', 'tagList',
		function (topNavCategory, usefulLinks, top10Comments, top10ViewNums, archiveList, tagList){
			res.send({
				success: true,
				data: arguments
			});
		}
	);

	ep.fail(function (err){
		next(err);
	});

	Tag.findAll(function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		/* 获取全部的标签 */
		var tags = docs;

		Article.findAll(null, function (err, status, msg, docs){
			if(err) return ep.emit('error', err);

			var articles = docs;

			var tagList = [];

			for(var i in tags){
				var tag = tags[i];

				var tag_2 = {
					Id: tag._id,
					TagName: tag.TagName,
					Articles: []
				};
				tagList.push(tag_2);

				for(var j in articles){
					var article = articles[j];

					if(article.Tags && article.Tags.length && -1 < article.Tags.indexOf(','+ tag.TagName +',')){
						tag_2.Articles.push(article);
					}
				}
			}

			/* 未添加标签的归为一类 */
			var tag_3 = {
				Id: '',
				TagName: '未归类',
				Articles: []
			};
			tagList.push(tag_3);

			for(var j in articles){
				var article = articles[j];

				if(!article.Tags.length){
					tag_3.Articles.push(article);
				}
			}

			fs.readFile(path.join(vmPath, 'TagList.vm.html'), 'utf8', function (err, template){
				if(err) return ep.emit('error', err);

				var html = velocity.render(template, {
					virtualPath: virtualPath,
					tagList: tagList
				});

				fs.writeFile(path.join(vmPath, 'html', 'tagList.html'), html, 'utf8', function (err){
					if(err) return ep.emit('error', err);
					ep.emit('tagList', true);
				});
			});
		});
	});

	/* 档案馆 */
	Article.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		/* 生成档案馆对象 */
		var archives = [],
			archive,
			articles = docs,
			article,
			archiveChild;

		for(var i in articles){
			article = articles[i];

			if(archives.length){
				/* 获取最后一条记录年 */
				archive = archives[archives.length - 1];

				if(article.PostTime.getFullYear() == archive.Y4){
					/* 获取最后一条记录月 */
					archiveChild = archive.ArchiveChildren[archive.ArchiveChildren.length - 1];
					if(article.PostTime2Month == archiveChild.M2){
						archiveChild.Articles.push(article);
					}else{
						archiveChild = {
							'M2': article.PostTime2Month,
							'Articles': []
						};

						archiveChild.Articles.push(article);
						archive.ArchiveChildren.push(archiveChild);
					}

				}else{
					/* 添加年 */
					archive = {
						'Y4': article.PostTime.getFullYear(),
						'ArchiveChildren': []
					};

					/* 添加月 */
					archiveChild = {
						'M2': article.PostTime2Month,
						'Articles': []
					}

					archiveChild.Articles.push(article);
					archive.ArchiveChildren.push(archiveChild);
					archives.push(archive);
				}
			}else{
				/* 添加年 */
				archive = {
					'Y4': article.PostTime.getFullYear(),
					'ArchiveChildren': []
				};

				/* 添加月 */
				archiveChild = {
					'M2': article.PostTime2Month,
					'Articles': []
				}

				archiveChild.Articles.push(article);
				archive.ArchiveChildren.push(archiveChild);
				archives.push(archive);
			}
		}

		fs.readFile(path.join(vmPath, 'ArchiveList.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				archiveList: archives
			});

			fs.writeFile(path.join(vmPath, 'html', 'archiveList.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('archiveList', true);
			});
		});
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