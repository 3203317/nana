var ObjectId = require('mongodb').ObjectID,
	async = require('async');

var models = require('../models'),
	Link = models.Link;

/**
 * 保存新文章
 *
 * @params {Object} newInfo
 * @params {Function} cb
 * @return
 */
exports.saveNew = function(newInfo, cb){
	Link.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

exports.findLinks = function(cb){
	Link.find(null, null, {
		sort: {
			Sort: -1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
	});
};

exports.install = function(cb){
	var that = this;

	that.uninstall();

	async.waterfall([
		function (cb){
			that.saveNew({
				User_Id: ObjectId(),
				LinkName: '起点中文网',
				LinkUrl: 'http://www.qidian.com',
				Sort: 1
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
	Link.remove({}, function (err, count){
		console.log('uninstall Links.');
	});
};