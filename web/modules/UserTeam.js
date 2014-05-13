var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

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
 * @params user_id 用户id
 * @return 
 */
UserTeamSchema.statics.findTeamsByUserId = function(user_id, cb) {
	this.find({
		User_Id: user_id
	}, null, {
		sort: {
			Sort: -1
		}
	}, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

UserTeamSchema.statics.findTeamByName = function(user_id, teamName, cb) {
	this.findOne({
		User_Id: user_id,
		TeamName: teamName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
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

	var that = this;

	that.findTeamByName(newInfo.User_Id, newInfo.TeamName, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, 3, ['分组名称已存在', 'TeamName'], doc);

		newInfo.Id = util.uuid(false);
		newInfo.CreateTime = new Date();

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc ? 1 : 2, doc ? '新分组创建成功' : '新分组创建失败', doc);
		});
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

	this.update({
		Id: newInfo.Id,
		User_Id: newInfo.User_Id
	}, {
		'$set': {
			TeamName: newInfo.TeamName,
			Sort: newInfo.Sort
		}
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
UserTeamSchema.statics.removes = function(id, user_id, cb) {

	this.remove({
		Id: id,
		User_Id: user_id
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

var UserTeamModel = mongoose.model('userteam', UserTeamSchema);

exports = module.exports = UserTeamModel;