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
	A_User_Id: {		//申请方
		type: String
	},
	P_User_Id: {		//被申请方
		type: String
	},
	A_Team_Id: {		//申请方
		type: String
	},
	P_Team_Id: {		//被申请方
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
 * @params 
 * @return true || false
 */
UserFriendSchema.statics.isFriend = function(a_user_id, p_user_id, cb) {

	var that = this;

	that.findOne({
		A_User_Id: a_user_id,
		P_User_Id: p_user_id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, true);

		that.findOne({
			A_User_Id: p_user_id,
			P_User_Id: a_user_id
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
UserFriendSchema.statics.getMyFriends = function(user_id, cb) {
	// todo

	this.find({
		'$or': [{
			A_User_Id: user_id
		}, {
			P_User_Id: user_id
		}]
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var UserFriendModel = mongoose.model('userfriend', UserFriendSchema);

exports = module.exports = UserFriendModel;