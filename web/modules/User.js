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
	UserFriend = require('./UserFriend'),
	FriendApplyMsg = require('./friend/FriendApplyMsg');

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

/**
 *
 * @method 查询所有用户
 * @params 
 * @return 
 */
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
 * @params newInfo 用户对象
 * @return 
 */
UserSchema.statics.register = function(newInfo, cb) {
	/* 表单参数验证 */
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	var that = this;

	/* 查询邮箱是否存在 */
	that.findUserByEmail(newInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象存在，则说明电子邮箱存在，返回提示信息 */
		if(doc) return cb(null, 3, ['电子邮箱已经存在。', 'Email'], doc);

		/* 用户对象入库之前的其他数据初始化工作 */
		newInfo.Id = util.uuid(false);
		newInfo.RegTime = new Date();
		newInfo.Status = 0;
		newInfo.IsDel = 0;

		newInfo.SecPass = newInfo.UserPass;
		/* 密码加密 */
		newInfo.UserPass = md5.hex(newInfo.SecPass);

		/* 开始创建新用户 */
		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, '新用户注册成功。', doc);
		});
	});
};

/**
 *
 * @method 发送注册认证邮件
 * @params email 电子邮箱
 * @return 
 */
UserSchema.statics.sendRegEmail = function(email, cb) {
	/* 通过电子邮箱查询用户对象 */
	this.findUserByEmail(email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象不存在，则说明没有找到用户，return */
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		/* 如果用户对象的Status不为0，则说明用户状态已经激活，return */
		if(doc.Status) return cb(null, 4, ['用户状态已激活。', 'Status'], doc);

		/* 生成12位随机确认码 */
		var ackCode = util.random(12);

		/* 更新用户对象的确认码字段 */
		doc.update({
			AckCode: ackCode
		}, function (err, count){
			if(err) return cb(err);
			/* 更新确认码字段成功 */
			cb(null, 1, '发送注册认证邮件成功。', doc);

			/* 获取发送给用户的邮件模板 */
			getRegEmailTemp(function (err, template){
				if(err) return;

				/* 通过模板生成邮件HTML代码 */
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
 * @method 新注册用户认证
 * @params email 电子邮件
 * @params ackCode 确认码
 * @return 
 */
UserSchema.statics.ackRegEmail = function(email, ackCode, cb) {

	this.findUserByEmail(email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象为空，则说明没有找到该用户，return */
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		/* 如果用户对象的Status不为0，则说明用户状态已经激活，return */
		if(doc.Status) return cb(null, 4, ['用户状态已激活。', 'Status'], doc);
		/* 如果用户输入的确认码与库中存的确认码不符，return */
		if(ackCode !== doc.AckCode) return cb(null, 5, ['认证码输入错误。', 'AckCode'], doc);

		/* 更新用户的Status状态 */
		doc.update({
			Status: 1
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 1, '激活成功。', doc);
		});
	});
};

/**
 *
 * @method 网站登陆
 * @params logInfo 用户登陆对象
 *				  .Email
 *				  .UserPass
 * @return 
 */
UserSchema.statics.login = function(logInfo, cb) {

	this.findUserByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象为空，则说明没有找到该用户，return */
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		/* 如果用户的IsDel属性为1，则说明用户标记为已删除，return */
		if(doc.IsDel) return cb(null, 4, ['该用户已禁止登陆。', 'Email'], doc);
		/* 如果用户对象的Status为0，则说明用户状态未激活，return */
		if(!doc.Status) return cb(null, 5, ['用户未通过认证。', 'Status'], doc);
		/* 如果用户输入的密码与库中的密码不符，return */
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);

		cb(null, 1, '登陆成功。', doc);
	});
};

/**
 * @requir 必已经调用登陆方法
 * @method 客户端登陆
 * @params logInfo 用户登陆对象
 *				  .Email
 *				  .UserPass
 *				  .Device
 * @return [用户信息, 密钥信息, 设备信息]
 */
UserSchema.statics.loginClient = function(logInfo, cb) {

	this.findUserByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象为空，则说明没有找到该用户，return */
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		/* 如果用户的IsDel属性为1，则说明用户标记为已删除，return */
		if(doc.IsDel) return cb(null, 4, ['该用户已禁止登陆。', 'Email'], doc);
		/* 如果用户对象的Status为0，则说明用户状态未激活，return */
		if(!doc.Status) return cb(null, 5, ['用户未通过认证。', 'Status'], doc);
		/* 如果用户输入的密码与库中的密码不符，return */
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);

		var ep = EventProxy.create('sec', 'device', function (sec, device){
			cb(null, 1, '登陆成功。', [doc, sec, device]);
		});

		ep.fail(function (err){
			cb(err);
		});

		/* 更新ApiKey和私钥 */
		var sec = {
			ApiKey: genApiKey(),
			SecKey: genSecKey()
		};

		/* 更新密钥 */
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
 * @method 客户端退出
 * @params logInfo
 * @return [用户信息, 设备信息]
 */
UserSchema.statics.logoutClient = function(logInfo, cb) {

	this.findUserByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象为空，则说明没有找到该用户，return */
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		/* 如果用户的IsDel属性为1，则说明用户标记为已删除，return */
		if(doc.IsDel) return cb(null, 4, ['该用户已禁止登陆。', 'Email'], doc);
		/* 如果用户对象的Status为0，则说明用户状态未激活，return */
		if(!doc.Status) return cb(null, 5, ['用户未通过认证。', 'Status'], doc);
		/* 如果用户输入的密码与库中的密码不符，return */
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);

		var userInfo = doc;
		
		var deviceInfo = logInfo.Device;
		deviceInfo.User_Id = doc.Id;

		Device.logout(deviceInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, '退出成功。', [userInfo, doc]);
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
		UserName: new RegExp(userName, 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 通过用户名或电子邮箱查找用户
 * @params userName 用户名
 * @params email 电子邮箱
 * @return 
 */
UserSchema.statics.findUserByNameEmail = function(userName, email, cb) {
	this.findOne({
		'$or': [{
			UserName: new RegExp(userName, 'i')
		}, {
			Email: new RegExp(email, 'i')
		}]
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 通过邮箱查询用户
 *
 * @params {String} email 电子邮箱（忽略大小写）
 * @params {Function} cb 回调函数
 * @return {Object} 用户对象
 */
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
 * @return [我的分组列表, 我的好友列表]
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

/**
 *
 * @method 申请好友
 * @params 
 * @return
 */
UserSchema.statics.applyFriend = function(a_user_id, p_user_id, content, cb) {

	UserFriend.isFriend(a_user_id, p_user_id, function (err, bool){
		if(bool) return cb(null, 3, '你们已经是好友啦。', bool);

		FriendApplyMsg.saveNew({
			A_User_Id: a_user_id,
			P_User_Id: p_user_id,
			Content: content
		}, function (err, doc){
			if(err) return cb(err);
			cb(null, +(!!doc), '发送好友申请消息'+ (!!doc ? '成功' : '失败') +'。', doc);
		});
	});
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