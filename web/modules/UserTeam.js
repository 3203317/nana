var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserTeamSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	TeamName: {
		type: String,
		required: true
	},
	Sort: {
		type: Number,
		default: 1
	},
	User_Id: {
		type: String
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserTeamSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

UserTeamSchema.pre('save', function(next, done){
	next();
});

UserTeamSchema.post('save', function(){
});

/**
 *
 * @method 查找我的分组列表
 * @params user_Id 用户id
 * @return 
 */
UserTeamSchema.statics.findTeamsByUserId = function(user_Id, cb) {
	this.find({
		User_Id: user_Id
	}, null, {
		sort: {
			CreateTime: -1
		}
	}, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @method 新增
 * @params 
 * @return 
 */
UserTeamSchema.statics.saveNew = function(newInfo, cb) {
	// todo

	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 编辑
 * @params 
 * @return 
 */
UserTeamSchema.statics.edit = function(newInfo, cb) {
	// todo

	delete newInfo.User_Id;
	delete newInfo.CreateTime;

	this.update({
		Id: newInfo.Id
	}, {
		'$set': newInfo
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

/**
 *
 * @method 删除
 * @params 
 * @return 
 */
UserTeamSchema.statics.removes = function(id, cb) {

	this.remove({
		Id: id
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

var UserTeamModel = mongoose.model('userteam', UserTeamSchema);

exports = module.exports = UserTeamModel;