/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	cache = util.cache;

var conf = require('../settings');

var exports = module.exports;

// biz
var Article = require('../biz/article');

(function (exports, global){
	function func(cb){
		Article.procTag(function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * 标签馆数据
	 *
	 * @params
	 * @return
	 */
	exports.procTag = function(cb){
		cache.get('procTag', 1000 * 30, [func], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);

(function (exports, global){
	function func(cb){
		Article.procArchive(function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * 档案馆数据
	 *
	 * @params
	 * @return
	 */
	exports.procArchive = function(cb){
		cache.get('procArchive', 1000 * 30, [func], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);

(function (exports, global){
	function func(cb){
		Article.findList(1, null, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * 查找第一页的文章
	 *
	 * @params
	 * @return
	 */
	exports.findFirstPage = function(cb){
		cache.get('ArticleFirstPageList', 1000 * 30, [func], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);

(function (exports, global){
	function func(num, cb){
		Article.findBookmarkTopN(num, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * topmarks
	 *
	 * @params
	 * @return
	 */
	exports.findBookmarkTopN = function(num, cb){
		cache.get('BookmarkTopN', 1000 * 30, [func, num], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);

(function (exports, global){
	function func(num, cb){
		Article.findHotTopN(num, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	}
	/**
	 * 获取热门文章前N
	 *
	 * @params
	 * @return
	 */
	exports.findHotTopN = function(num, cb){
		cache.get('ArticleHotTopN', 1000 * 30, [func, num], function (err, data){
			if(err) return cb(err);
			cb(null, data);
		});
	};
})(exports);