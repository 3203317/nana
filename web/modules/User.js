var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var fs = require('fs'),
	velocity = require('velocityjs'),
	cwd = process.cwd();

var util = require('../libs/utils'),
	md5 = require('../libs/md5'),
	mailer = require('../libs/mailer');

var Module = require('./Module'),
	Device = require('./Device'),
	userRegFrm = require('../public/user/userRegFrm');

var UserSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	UserName: {
		type: String,
		// match: /[a-z]/,
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
		default: 3
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
	AckCode: {			//用户注册邮箱认证码
		type: String
	},
	Email: {			//邮箱
		type: String,
		required: true
	},
	SafeEmail: {		//安全邮箱
		type: String
	},
	RegTime: {
		type: Date,
		default: Date.now
	},
	Status: {			//状态, 未激活0, 邮箱激活1, 短信激活2
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

/**
 *
 * @method 新用户注册
 * @params 
 * @return 
 */
UserSchema.statics.register = function(newInfo, cb) {
	var valiResu = userRegFrm.validate(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	that.findUserByNameEmail(newInfo.UserName, newInfo.Email, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, 3, newInfo.UserName === doc.UserName ? ['用户名已经存在', 'UserName'] : ['电子邮箱已经存在', 'Email'], doc);

		/* 数据入库 */
		newInfo.Id = util.uuid(false);
		newInfo.RegTime = new Date();
		newInfo.Status = 0;
		newInfo.IsDel = 0;

		newInfo.SecretPass = newInfo.UserPass;
		newInfo.UserPass = md5.hex(newInfo.SecretPass);

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc ? 1 : 2, [doc ? '新用户注册成功' : '新用户注册失败'], doc);
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
	userName = userName.trim().toLowerCase();

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户', 'UserName']);
		if(doc.Status) return cb(null, 2, ['用户状态已激活', 'Status'], doc);

		var ackCode = util.random(12);

		doc.update({
			AckCode: ackCode
		}, function (err, count){
			if(err) return cb(err);
			if(!count) return cb(null, 4, ['用户认证码更新失败', 'AckCode'], doc);

			getRegEmailTemp(function (err, template){
				if(err) return cb(err);

				var html = velocity.render(template, {
					user: doc,
					ackCode: ackCode
				});

				/* 尝试发送注册邮件确认 */
				mailer.send({
					to: doc.Email,
					subject: '找呗(www.zhaobe.com)绑定邮箱验证码',
					html: html
				}, function (err, ok){
					// if(err) return cb(null, 5, '发送注册认证邮件失败', doc);
				});
				cb(null, 1, ['发送注册认证邮件成功', 'Email'], doc);
			});
		});
	});
};

var regEmailTemp;
/**
 *
 * @method 获取注册认证邮件模板
 * @params 
 * @return 
 */
function getRegEmailTemp(cb){
	if(regEmailTemp) return cb(null, regEmailTemp);
	fs.readFile(cwd +'/views/User/SendRegEmail.email.html', 'utf8', function (err, template){
		if(err) return cb(err);
		regEmailTemp = template;
		cb(null, regEmailTemp);
	});
}

/**
 *
 * @method 注册认证邮件确认
 * @params 
 * @return 
 */
UserSchema.statics.ackRegEmail = function(userName, ackCode, cb) {

	var userName = userName.toLowerCase();

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, '找不到该用户');
		if(doc.Status) return cb(null, 2, '已激活用户', doc);
		if(ackCode !== doc.AckCode) return cb(null, 4, '认证码输入错误');

		doc.update({
			Status: 1
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 1, '已激活成功', doc);
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

	var userName = userName.toLowerCase();

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 2, '找不到该用户');
		if(doc.IsDel) return cb(null, 3, '找不到该用户', doc);
		if(!doc.Status) return cb(null, 4, '用户未通过认证', doc);
		if(md5.hex(userPass) !== doc.UserPass) return cb(null, 5, '用户名或密码输入错误', doc);
		cb(null, 1, '登陆成功', doc);
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
		if(doc.IsDel) return cb(null, '用户已删除');
		if(!doc.Status) return cb(null, '用户未通过认证');
		if(md5.hex(clientInfo.UserPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		
		var deviceInfo = clientInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.login(deviceInfo, function (err, doc){
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
		if(doc.IsDel) return cb(null, '用户已删除');
		if(!doc.Status) return cb(null, '用户未通过认证');
		if(md5.hex(clientInfo.UserPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		
		var deviceInfo = clientInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.logout(deviceInfo, function (err, doc){
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
	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

UserSchema.statics.findUserByNameEmail = function(userName, email, cb) {
	this.findOne({
		'$or': [{
			UserName: userName
		}, {
			Email: email
		}]
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 找回密码
 * @params userName 用户名
 * @return 
 */
UserSchema.statics.findPassword = function(userName, cb) {

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(doc.IsDel) return cb(null, '用户已删除');
		if(!doc.Status) return cb(null, '用户未通过认证');

		var para1 = {};
		para1.SecretPass = util.random(6);
		para1.UserPass = md5.hex(para1.SecretPass);

		doc.update(para1, function (err, doc){
			if(err) return cb(err);
			/* 发送密码邮件 */
			cb(null, null);
		});
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