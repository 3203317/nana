var db = require('./mongodb');
var util = require('../libs/utils');
var md5 = require('../libs/md5');
var Module = require('./Module');
var Device = require('./Device');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var str1 = '用户名或密码不能为空';

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
		type: String
	},
	SecretPass: {
		type: String,
		default: '123456'
	},
	Sex: {
		type: Number,
		default: 1
	},
	Nickname: {
		type: String
	},
	Birthday: {
		type: Date
	},
	QQ: {
		type: String
	},
	Lv: {
		type: Number
	},
	DeviceId: {			//设备唯一码(用户正在使用)
		type: String
	},
	AckCode: {			//用户注册邮箱认证码
		type: String
	},
	RegTime: {
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

UserSchema.virtual('sStatus').get(function(){
	switch(this.Status){
		case 0: return '未激活';
		case 1: return '邮箱';
		case 2: return '短信';
		default: return '未知';
	}
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

function valiRegFrm(data){
	if(!data.UserName) return '用户名不能为空';
}

/**
 *
 * @method 新用户注册
 * @params 
 * @return 
 */
UserSchema.statics.register = function(newInfo, cb) {
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	that.findUserByUserName(newInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if('string' !== typeof doc) return cb(null, '用户名已经存在');
		/* 数据入库 */
		newInfo.Id = util.uuid(false);
		newInfo.UserName = newInfo.UserName.toLowerCase();
		newInfo.Lv = 2;
		newInfo.RegTime = new Date();
		newInfo.Status = 0;
		newInfo.IsDel = 0;

		newInfo.SecretPass = util.random(6);
		newInfo.UserPass = md5.hex(newInfo.SecretPass);

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 发送注册认证邮件(用户启用时)
 * @params 
 * @return 
 */
UserSchema.statics.sendRegEmail = function(userName, cb) {

	var that = this;

	that.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.Status) return cb(null, '用户已认证通过');

		doc.update({
			AckCode: util.random(12)
		}, function (err, doc){
			if(err) return cb(err);
			/* 尝试发送注册邮件确认 */
			cb(null, null);
		});
	});
};

/**
 *
 * @method 注册认证邮件确认
 * @params ackInfo 确认信息
 * @return 
 */
UserSchema.statics.ackRegEmail = function(ackInfo, cb) {

	var that = this;

	that.findUserByUserName(ackInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.Status) return cb(null, '用户已认证通过');
		if(ackInfo.AckCode !== doc.AckCode) return cb(null, '认证码输入错误');

		doc.update({
			Status: 1
		}, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 网站登陆
 * @params 
 * @return 
 */
UserSchema.statics.login = function(userName, userPass, cb) {

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.IsDel) return cb(null, '用户已删除,禁止登陆');
		if(!doc.Status) return cb(null, '用户未通过认证');
		if(md5.hex(userPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		cb(null, doc);
	});
};

/**
 *
 * @method 后台管理登陆
 * @params 
 * @return 
 */
UserSchema.statics.loginBackStage = function(userName, userPass, cb) {

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(1 !== doc.Lv) return cb(null, '无权访问');
		if(md5.hex(userPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		cb(null, doc);
	});
};

/**
 *
 * @method 登陆客户端
 * @params 
 * @return 
 */
UserSchema.statics.loginClient = function(clientInfo, cb) {

	this.findUserByUserName(clientInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.IsDel) return cb(null, '用户已删除,禁止登陆');
		if(!doc.Status) return cb(null, '用户未通过认证');
		if(md5.hex(clientInfo.UserPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		
		var deviceInfo = clientInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.deviceLogin(deviceInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 退出客户端
 * @params 
 * @return 
 */
UserSchema.statics.logoutClient = function(clientInfo, cb) {

	this.findUserByUserName(clientInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.IsDel) return cb(null, '用户已删除,禁止退出');
		if(!doc.Status) return cb(null, '用户未通过认证');
		if(md5.hex(clientInfo.UserPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		
		var deviceInfo = clientInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.deviceLogout(deviceInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 通过用户名查找用户
 * @params userName 用户名
 * @return 
 */
UserSchema.statics.findUserByUserName = function(userName, cb) {
	/* 用户名转换小写 */
	userName = userName.toLowerCase();

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