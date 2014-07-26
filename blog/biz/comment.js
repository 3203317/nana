var ObjectId = require('mongodb').ObjectID,
	async = require('async');

var models = require('../models'),
	Comment = models.Comment;

/**
 * 保存新评论
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Comment.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

/**
 * 分页查询
 *
 * @params {Array} page
 * @params {Function} cb
 * @return
 */
exports.findComments = function(page, cb){
	var option = {
		skip: 0,
		limit: 10,
		sort: {
			PostTime: -1
		}
	};

	if(page){
		option.limit = page[1];
		option.skip = ((page[0] - 1) * option.limit);
	}

	Comment.find(null, null, option, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};

/**
 * 数据初始化
 *
 * @params {Function} cb
 * @return
 */
exports.install = function(cb){
	var that = this;

	that.uninstall();

	async.waterfall([
		function (cb){
			that.saveNew({
				Article_Id: ObjectId(),
				PostTime: new Date('2009/11/13 22:48:24'),
				Content: 'OK',
				PostIP: '222.170.61.69',
				Author: 'yttyt'
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				Article_Id: ObjectId(),
				PostTime: new Date('2010/1/11 19:01:17'),
				Content: '最后一关99波31万多分',
				PostIP: '210.72.9.53',
				Author: 'don_xu'
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				Article_Id: ObjectId(),
				PostTime: new Date('2010/2/4 11:39:23'),
				Content: '爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市爱的嗷嗷嗷安达市',
				PostIP: '118.249.151.16',
				Author: '嗷嗷嗷'
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}
	], function (err, result){
		if(err) that.uninstall();
		cb(err, +!!err, null, result);
	});
};

exports.uninstall = function(cb){
	Comment.remove({}, function (err, count){
		console.log('uninstall Comments.');
	});
};