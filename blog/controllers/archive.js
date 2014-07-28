var conf = require('../settings'),
	util = require('../lib/util');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Article = require('../biz/article');

function getTopMessage(){
	var time = new Date();
	var year = time.getFullYear();
	var month = util.pdate(time.getMonth() + 1);
	var day = util.pdate(time.getDate());
	return '欢迎您。今天是'+ year +'年'+ month +'月'+ day +'日。';
};

exports.index = function(req, res, next){
	Article.findAll(function (err, status, msg, docs){
		if(err) return next(err);

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
					if(article.PostTime.getMonth() == archiveChild.M2){
						archiveChild.Articles.push(article);
					}else{
						archiveChild = {
							'M2': article.PostTime.getMonth(),
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
						'M2': article.PostTime.getMonth(),
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
					'M2': article.PostTime.getMonth(),
					'Articles': []
				}

				archiveChild.Articles.push(article);

				archive.ArchiveChildren.push(archiveChild);

				archives.push(archive);
			}
		}

		res.render('Archive', {
			moduleName: 'archive',
			title: title,
			atitle: '档案馆',
			description: '档案馆',
			keywords: ',档案馆,Bootstrap3',
			virtualPath: virtualPath,
			topMessage: getTopMessage(),
			cdn: conf.cdn,
			archives: archives
		});
	});
};