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
	Email: {
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
	var bt = this.Birthday;
	return bt ? bt.getFullYear() +'/'+
			util.pdate(bt.getMonth()+1) +'/'+
			util.pdate(bt.getDate()) +' '+
			bt.getHours() +':'+
			util.pdate(bt.getMinutes()) +':'+
			util.pdate(bt.getSeconds()) : '';
});

UserSchema.virtual('sRegTime').get(function(){
	var rt = this.RegTime;
	return rt.getFullYear() +'/'+
			util.pdate(rt.getMonth()+1) +'/'+
			util.pdate(rt.getDate()) +' '+
			rt.getHours() +':'+
			util.pdate(rt.getMinutes()) +':'+
			util.pdate(rt.getSeconds());
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
 * @method 验证注册表单
 * @params 
 * @return 
 */
function valiRegForm(data){
	if('' === data.UserName || '' === data.UserPass){
		return '用户名或密码不能为空';
	}
}

/**
 *
 * @method 新用户注册
 * @params 
 * @return 
 */
UserSchema.statics.register = function(newInfo, cb) {
	var valiResu = valiRegForm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	this.findUserByUserName(newInfo.UserName, function (err, doc){
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
	if('' === data.UserName || '' === data.UserPass){
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

UserSchema.statics.findUserByUserName = function(userName, cb) {
	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, doc);
		cb('没有找到该用户');
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