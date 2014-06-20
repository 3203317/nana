var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var fs = require('fs'),
	velocity = require('velocityjs'),
	EventProxy = require('eventproxy'),
	cwd = process.cwd();

var util = require('../libs/utils'),
	md5 = require('../libs/md5'),
	mailer = require('../libs/mailer');

var Module = require('./Module'),
	Device = require('./Device'),
	UserTeam = require('./UserTeam'),
	UserFriend = require('./UserFriend');

var UserSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	UserName: {
		// required: true,
		// match: /[a-z]/,
		type: String
	},
	UserPass: {
		type: String
	},
	SecPass: {
		type: String,
		default: '123456'
	},
	Sex: {
		type: Number,
		default: 3
	},
	Nickname: {			//昵称
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
		index: true,
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
	},
	ApiKey: {
		type: String
	},
	SecKey: {			//密钥
		type: String
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
	return util.formatDate(this.Birthday);
});

UserSchema.virtual('sRegTime').get(function(){
	return util.formatDate(this.RegTime);
});

UserSchema.pre('save', function (next, done){
	next();
});

UserSchema.post('save', function(){
});

UserSchema.statics.findUsers = function(pagination, cb) {
	pagination[0] = pagination[0] || 1;

	this.find(null, null, {
		sort: {
			RegTime: -1
		},
		skip: (pagination[0] - 1) * pagination[1],
		limit: pagination[1]
	}, function (err, docs){
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
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	var that = this;

	that.findUserByEmail(newInfo.Email, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, 3, ['电子邮箱已经存在。', 'Email'], doc);

		/* 数据入库 */
		newInfo.Id = util.uuid(false);
		newInfo.RegTime = new Date();
		newInfo.Status = 0;
		newInfo.IsDel = 0;

		newInfo.SecPass = newInfo.UserPass;
		newInfo.UserPass = md5.hex(newInfo.SecPass);

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, '新用户注册成功。', doc);
		});
	});
};

/**
 *
 * @method 发送注册认证邮件(用户启用时)
 * @params 
 * @return 
 */
UserSchema.statics.sendRegEmail = function(email, cb) {

	this.findUserByEmail(email, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		if(doc.Status) return cb(null, 4, ['用户状态已激活。', 'Status'], doc);

		var ackCode = util.random(12);

		doc.update({
			AckCode: ackCode
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 1, '发送注册认证邮件成功', doc);

			getRegEmailTemp(function (err, template){
				if(err) return;

				var html = velocity.render(template, {
					user: doc,
					ackCode: ackCode
				});

				/* 尝试发送注册邮件确认 */
				mailer.send({
					to: doc.Email,
					subject: '欢迎注册找呗(www.zhaobe.com)(请不要回复此邮件)',
					html: html
				}, function (err, ok){
					// if(err) return cb(null, 5, '发送注册认证邮件失败', doc);
				});
			});
		});
	});
};

/**
 *
 * @method 注册认证邮件确认
 * @params 
 * @return 
 */
UserSchema.statics.ackRegEmail = function(userName, ackCode, cb) {
	userName = userName.toLowerCase();

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户', 'UserName']);
		if(doc.Status) return cb(null, 4, ['用户状态已激活', 'Status'], doc);
		if(ackCode !== doc.AckCode) return cb(null, 5, ['认证码输入错误', 'AckCode'], doc);

		doc.update({
			Status: 1
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 1, '激活成功', count);
		});
	});
};

/**
 *
 * @method 网站登陆
 * @params 
 * @return 
 */
UserSchema.statics.login = function(logInfo, cb) {
	// todo

	logInfo.UserName = logInfo.UserName.toLowerCase();

	this.findUserByUserName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户', 'UserName']);
		if(doc.IsDel) return cb(null, 4, ['找不到该用户', 'UserName'], doc);
		if(!doc.Status) return cb(null, 5, ['用户未通过认证', 'Status'], doc);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass) return cb(null, 6, ['用户名或密码输入错误', 'UserPass'], doc);
		cb(null, 1, '登陆成功', doc);
	});
};

/**
 * @requir 必已经调用登陆方法
 * @method 登陆客户端
 * @params 
 * @return 
 */
UserSchema.statics.loginClient = function(logInfo, cb) {
	// todo

	this.findUserByUserName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户', 'UserName']);
		if(doc.IsDel) return cb(null, 4, ['找不到该用户', 'UserName'], doc);
		if(!doc.Status) return cb(null, 5, ['用户未通过认证', 'Status'], doc);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass) return cb(null, 6, ['用户名或密码输入错误', 'UserPass'], doc);

		var ep = EventProxy.create('sec', 'device', function (sec, device){
			cb(null, 1, '登陆成功', [doc, sec, device]);
		});

		ep.fail(function (err){
			cb(err);
		});

		/* 更新ApiKey和私钥 */
		var sec = {
			ApiKey: genApiKey(),
			SecKey: genSecKey()
		};

		doc.update(sec, function (err, count){
			if(err) return ep.emit('error', err);
			ep.emit('sec', sec);
		});

		/* 客户端设备登陆 */
		var deviceInfo = logInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.login(deviceInfo, ep.done('device'));
	});
};

/**
 *
 * @method 退出客户端
 * @params 
 * @return 
 */
UserSchema.statics.logoutClient = function(logInfo, cb) {

	this.findUserByUserName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户', 'UserName']);
		if(doc.IsDel) return cb(null, 4, ['找不到该用户', 'UserName'], doc);
		if(!doc.Status) return cb(null, 5, ['用户未通过认证', 'Status'], doc);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass) return cb(null, 6, ['用户名或密码输入错误', 'UserPass'], doc);

		var userInfo = doc;
		
		var deviceInfo = logInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.logout(deviceInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, '退出成功', [userInfo, doc]);
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

UserSchema.statics.findUserByEmail = function(email, cb) {
	this.findOne({
		Email: new RegExp(email, 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 获取好友分组
 * @params 
 * @return 
 */
UserSchema.statics.findFriendTeams = function(user_id, cb) {
	// todo

	var ep = EventProxy.create('teams', 'friends', function (teams, friends){
		cb(null, 1, null, [teams, friends]);
	});

	ep.fail(function (err){
		cb(err);
	});

	UserTeam.findTeamsByUserId(user_id, ep.done('teams'));

	UserFriend.findFriendsByUserId(user_id, ep.done('friends'));
};


var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;


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
 * @method 生成ApiKey(随机)
 * @params 
 * @return 
 */
function genApiKey(){
	return '123456';
}

/**
 *
 * @method 生成私钥(随机)
 * @params 
 * @return 
 */
function genSecKey(){
	return '654321';
}

function valiRegFrm(data){
	if(!data) return '参数异常';
	if(!util.isEmail(data.Email)) return ['请输入正确的格式，例如：example@example.com。', 'Email'];
	if(!data.UserPass || !/^[\w]{6,16}$/.test(data.UserPass)) return ['仅支持6-16位数字、字母（大小写）或下划线。', 'UserPass'];
}