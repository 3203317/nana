var db = require('./../mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../../libs/utils');

var FriendApplyMsgSchema = new Schema({
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
	Content: {			//消息内容
		type: String
	},
	IsPass: {			//是否通过, 通过1, 否0
		type: Number,
		default: 0
	},
	CreateTime: {
		type: Date,
		default: Date.now
	},
	IsDel: {			//删除标记, 删除1, 否0
		type: Number,
		default: 0
	}
}, {
	versionKey: false
});

FriendApplyMsgSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

/**
 *
 * @method 好友申请
 * @params newInfo
 * @return 
 */
FriendApplyMsgSchema.statics.saveNew = function(newInfo, cb) {

	newInfo.Id = util.uuid(false);
	newInfo.IsPass = 0;
	newInfo.CreateTime = new Date();
	newInfo.IsDel = 0;

	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var FriendApplyMsgModel = mongoose.model('friendapplymsg', FriendApplyMsgSchema);

exports = module.exports = FriendApplyMsgModel;