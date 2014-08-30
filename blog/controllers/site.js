var conf = require('../settings'),
	EventProxy = require('eventproxy'),
	util = require('../lib/util');

var fs = require('fs'),
	path = require('path'),
	cwd = process.cwd(),
	qs = require('querystring'),
	velocity = require('velocityjs');

var Comment = require('../biz/comment'),
	Link = require('../biz/link'),
	Article = require('../biz/article'),
	Tag = require('../biz/tag'),
	Category = require('../biz/category');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var macros = require('../lib/macro');

function getTopMessage(){
	var t = new Date();
	var y = t.getFullYear();
	var m = util.pdate(t.getMonth() + 1);
	var d = util.pdate(t.getDate());
	return '欢迎您。今天是'+ y +'年'+ m +'月'+ d +'日。';
};

exports.indexUI = function(req, res, next){
	res.render('Index', {
		moduleName: 'index',
		title: title,
		description: '',
		keywords: ',个人博客,Blog,Bootstrap3,nodejs,express,css,javascript,java,asp,xhtml,html5',
		virtualPath: virtualPath,
		topMessage: getTopMessage(),
		loadMore: 'index',
		cdn: conf.cdn
	});
};

exports.indexUI_more = function(req, res, next){
	var data = req.query.data;
	if(!data) return res.send('');

	try{
		data = JSON.parse(data);
	}catch(ex){
		return res.send('');
	}

	if(!data.Current) return res.send('');

	Article.findAll({
		Bookmark: -1,
		_id: -1
	}, [10, data.Current], null, function (err, status, msg, docs){
		if(err) return res.send('');
		if(!docs || !docs.length) return res.send('');
		res.render(path.join(cwd, 'views', 'pagelet', 'ArticleIntros.vm.html'), {
			virtualPath: virtualPath,
			articles: docs
		});
	});
};

var http = require('http');

exports.commentUI = function(req, res, next){
	var params = {
		limit: 10,
		order: 'desc',
		short_name: 'foreworld',
		secret: '1d94719567add608482440a9c7a2e856'
	}, ress = res;
	http.get({
		host: 'api.duoshuo.com',
		port: 80,
		path: '/log/list.json?'+ qs.stringify(params)
	}, function (res){
		var size = 0;
		var chunks = [];
		res.on('data', function (chunk){
			size += chunk.length;
			chunks.push(chunk);
		}).on('end', function(){
			if(!size) return next(new Error('size: 0.'));
			var data = JSON.parse((Buffer.concat(chunks, size)).toString());
			if(data.code) return next(new Error(data.errorMessage));

			/* delete all records. */
			Comment.removeAll(function(){
				var responses = data.response,
					response;

				for(var i in responses){
					response = responses[i];

					if('create' === response.action){
						Comment.saveNew({
							Content: response.meta.message,
							PostIP: response.meta.ip,
							Author: response.meta.author_name,
							Article_Id: response.meta.thread_key,
							PostTime: response.meta.created_at,
							Author_Url: response.meta.author_url,
							Author_Id: response.meta.author_id
						}, function (err, status, msg, docs){
							console.log(err);
						});
					}
				}

				ress.send({
					success: true
				})
			});
		});
	}).on('error', function (err){
		next(err);
	});
};

exports.installUI = function(req, res, next){
	var vmPath = path.join(cwd, 'views', 'pagelet');

	var ep = EventProxy.create('topNavCategory', 'usefulLinks', 'side_comment_top10', 'side_art_view_top10', 'archives', 'tags', 'topMarks', 'hp_artIntro_top10',
		function (topNavCategory, usefulLinks, side_comment_top10, side_art_view_top10, archives, tags, topMarks, hp_artIntro_top10){
			res.send({
				success: true,
				data: arguments
			});
		}
	);

	ep.fail(function (err){
		next(err);
	});

	Article.findAll({
		Topmark: -1,
		_id: -1
	}, [10], null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'ArticleIntros.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				articles: docs
			}, macros);

			fs.writeFile(path.join(vmPath, 'html', 'hp.artIntro.top10.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('hp_artIntro_top10', true);
			});
		});
	});

	Article.findTopmarks(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'TopMarks.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				articles: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'topMarks.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('topMarks', true);
			});
		});
	});

	Tag.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		/* 获取全部的标签 */
		var tags = docs;

		Article.findAll({
			_id: -1
		}, null, null, function (err, status, msg, docs){
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

					if(article.Tags && article.Tags.length && -1 < ((','+ article.Tags +',').toLowerCase()).indexOf(','+ tag.TagName.toLowerCase() +',')){
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

			fs.readFile(path.join(vmPath, 'Tags.vm.html'), 'utf8', function (err, template){
				if(err) return ep.emit('error', err);

				var html = velocity.render(template, {
					virtualPath: virtualPath,
					tags: tagList
				}, macros);

				fs.writeFile(path.join(vmPath, 'html', 'tags.html'), html, 'utf8', function (err){
					if(err) return ep.emit('error', err);
					ep.emit('tags', true);
				});
			});
		});
	});

	/* 档案馆 */
	Article.findAll({
		_id: -1
	}, null, null, function (err, status, msg, docs){
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
					if(macros.toMon(article.PostTime) == archiveChild.M2){
						archiveChild.Articles.push(article);
					}else{
						archiveChild = {
							'M2': macros.toMon(article.PostTime),
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
						'M2': macros.toMon(article.PostTime),
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
					'M2': macros.toMon(article.PostTime),
					'Articles': []
				}

				archiveChild.Articles.push(article);
				archive.ArchiveChildren.push(archiveChild);
				archives.push(archive);
			}
		}

		fs.readFile(path.join(vmPath, 'Archives.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				archives: archives
			}, macros);

			fs.writeFile(path.join(vmPath, 'html', 'archives.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('archives', true);
			});
		});
	});

	/* 热门文章前10 */
	Article.findAll({
		ViewCount: -1
	}, [10], null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'Side.Art.View.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				articles: docs
			}, macros);

			fs.writeFile(path.join(vmPath, 'html', 'side.art.view.top10.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('side_art_view_top10', true);
			});
		});
	});

	/* 生成TOP分类 */
	Category.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'TopNavCategory.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				categorys: docs
			});

			fs.writeFile(path.join(vmPath, 'html', 'topNavCategory.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('topNavCategory', true);
			});
		});
	});

	/* 常用链接 */
	Link.findAll(null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'UsefulLinks.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				links: docs
			}, macros);

			fs.writeFile(path.join(vmPath, 'html', 'usefulLinks.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('usefulLinks', true);
			});
		});
	});

	/* 生成评论 */
	Comment.findAll([5], null, function (err, status, msg, docs){
		if(err) return ep.emit('error', err);

		fs.readFile(path.join(vmPath, 'Side.Comment.vm.html'), 'utf8', function (err, template){
			if(err) return ep.emit('error', err);

			var html = velocity.render(template, {
				virtualPath: virtualPath,
				comments: docs
			}, macros);

			fs.writeFile(path.join(vmPath, 'html', 'side.comment.top10.html'), html, 'utf8', function (err){
				if(err) return ep.emit('error', err);
				ep.emit('side_comment_top10', true);
			});
		});
	});
};