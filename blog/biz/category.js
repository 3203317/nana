var ObjectId = require('mongodb').ObjectID,
	async = require('async');

var models = require('../models'),
	Category = models.Category;

/**
 * 保存新
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Category.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

/**
 * 查询
 *
 * @params {Function} cb
 * @return
 */
exports.findCategorys = function(cb){
	var option = {
		sort: {
			Sort: 1
		}
	};

	Category.find(null, null, option, function (err, docs){
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
				User_Id: ObjectId(),
				CateName: '杂文',
				CateIntro: '杂文',
				CateCount: 1,
				Sort: 1
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				User_Id: ObjectId(),
				CateName: '设计模式',
				CateIntro: '设计模式',
				CateCount: 2,
				Sort: 2
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				User_Id: ObjectId(),
				CateName: '插件',
				CateIntro: '插件',
				CateCount: 3,
				Sort: 3
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				User_Id: ObjectId(),
				CateName: 'Java',
				CateIntro: 'Java',
				CateCount: 3,
				Sort: 5
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
		}, function (doc, cb){
			that.saveNew({
				User_Id: ObjectId(),
				CateName: 'ASP.NET',
				CateIntro: 'ASP.NET',
				CateCount: 3,
				Sort: 4
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
	Category.remove({}, function (err, count){
		console.log('uninstall Categorys.');
	});
};