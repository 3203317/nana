var db = require('./mongodb');
var util = require('../libs/utils');
var Module = require('./Module');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	UserName: {
		type: String,
		match: /[a-z]/,
		required: true
	},
	UserPass: {
		type: String,
		default: '123456'
	},
	Sex: {
		type: Number,
		default: 1
	},
	Birthday: {
		type: Date
	},
	QQ: {
		type: String
	},
	RegTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserSchema.virtual('sSex').get(function(){
	switch(this.Sex){
		case 1: return '男';
		case 2: return '女';
		default: return '未知';
	}
});

UserSchema.virtual('sBirthday').get(function(){
	return this.Birthday ? util.formatDate(this.Birthday) : '';
});

UserSchema.virtual('sRegTime').get(function(){
	return util.formatDate(this.RegTime);
});

UserSchema.pre('save', function(next, done){
	next();
});

UserSchema.post('save', function(){
});

UserSchema.statics.findUsers = function(pagination, cb) {
	pagination[0] = pagination[0] || 1;

	var para3 = {
		sort: {
			RegTime: -1
		},
		skip: (pagination[0] - 1) * pagination[1],
		limit: pagination[1]
	};

	this.find(null, null, para3, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @method 新用户注册
 * @params 
 * @return 
 */
UserSchema.statics.register = function(newInfo, cb) {
	if(!data.UserName || !data.UserPass) return cb('用户名或密码不能为空');
	data.UserName = data.UserName.trim();
	data.UserPass = data.UserPass.trim();
	if(0 === data.UserName.length || 0 === data.UserPass.length) return cb('用户名或密码不能为空');

	var that = this;

	that.findUserByUserName(newInfo.UserName, function (err, doc){
		if(err){
			if('string' === typeof err){
				newInfo.Id = util.uuid(false);
				newInfo.UserPass = util.md5(newInfo.UserPass);

				that.create(newInfo, function (err, doc){
					if(err) return cb(err);
					cb(null, doc);
				});
				return;
			}
			return cb(err);
		}
		cb('用户名已经存在');
	});
};

function valiLogForm(data){
	data.UserName = data.UserName.trim();
	data.UserPass = data.UserPass.trim();

	if(0 === data.UserName.length || 0 === data.UserPass.length){
		return '用户名或密码不能为空';
	}
}

UserSchema.statics.login = function(logInfo, cb) {
	var valiResu = valiLogForm(logInfo);
	if(valiResu) return cb(valiResu);

	this.findUserByUserName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(util.md5(logInfo.UserPass) === doc.UserPass) return cb(null, doc);
		cb('用户名或密码输入错误');
	});
};

/**
 *
 * @method 通过用户名查找用户
 * @params userName 用户名
 * @return 
 */
UserSchema.statics.findUserByUserName = function(userName, cb) {
	if(!userName) return cb('用户名不能为空');
	userName = userName.trim();
	if(0 === userName.length) return cb('用户名不能为空');

	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc ? doc : '没有找到该用户');
	});
};

UserSchema.statics.getMenuTree = function(userId, cb) {
	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;