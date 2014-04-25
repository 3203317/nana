var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserFriendSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	A_UserName: {		//申请方
		type: String
	},
	B_UserName: {		//被申请方
		type: String
	},
	CreateTime: {
		type: Date,
		default: Date.now
	},
	Status: {
		type: Number,
		default: 0
	},
	IsDel: {			//删除标记, 删除1, 否0
		type: Number,
		default: 0
	}
}, {
	versionKey: false
});

/**
 *
 * @method 判断两人是好友吗
 * @params a_userName 申请方
 * @params b_userName 被申请方
 * @return true || false
 */
UserFriendSchema.statics.isFriend = function(a_userName, b_userName, cb) {

	var that = this;

	that.findOne({
		A_UserName: a_userName,
		B_UserName: b_userName,
		IsDel: 0
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, true);

		that.findOne({
			A_UserName: b_userName,
			B_UserName: a_userName,
			IsDel: 0
		}, null, null, function (err, doc){
			if(err) return cb(err);
			cb(null, !!doc);
		});
	});
};

/**
 *
 * @method 好友申请
 * @params a_userName 申请方
 * @params b_userName 被申请方
 * @params comment 申请信息
 * @return 
 */
UserFriendSchema.statics.applyFriend = function(a_userName, b_userName, comment, cb) {

};

/**
 *
 * @method 获取我的好友
 * @params 
 * @return 
 */
UserFriendSchema.statics.getMyFriends = function(userName, cb) {

	var that = this;

	that.find({
		A_UserName: userName
	}, null, null, function (err, docs){
		if(err) return cb(err);
		var friends = docs;
		that.find({
			B_UserName: userName
		}, null, null, function (err, docs){
			if(err) return cb(err);
			cb(null, friends, docs);
		});
	});
};

var UserFriendModel = mongoose.model('userfriend', UserFriendSchema);

exports = module.exports = UserFriendModel;