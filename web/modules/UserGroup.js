var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserGroupSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	GroupName: {
		type: String,
		required: true
	},
	GroupDesc: {
		type: String
	},
	User_Id: {
		type: String
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

UserGroupSchema.pre('save', function(next, done){
	next();
});

UserGroupSchema.post('save', function(){
});

function valiAddFrm(data){
}

UserGroupSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiAddFrm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	newInfo.Id = util.uuid(false);
	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

UserGroupSchema.statics.findUserGroupsByUser = function(userId, cb) {
	if(!userId) return '用户Id不能为空';
	var user_id = userId.trim();
	if(0 === user_id.length) return '用户Id不能为空';
};

var UserGroupModel = mongoose.model('userGroup', UserGroupSchema);

exports = module.exports = UserGroupModel;