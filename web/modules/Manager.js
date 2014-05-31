var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils'),
	md5 = require('../libs/md5');

var Module = require('./Module'),
	mgrLoginFrm = require('../public/manage/manager/loginFrm'),
	mgrAddFrm = require('../public/manage/manager/addFrm'),
	mgrDelFrm = require('../public/manage/manager/delFrm'),
	mgrEditFrm = require('../public/manage/manager/editFrm');

var ManagerSchema = new Schema({
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
		type: String
	},
	Sex: {
		type: Number,
		default: 1
	},
	Email: {			//邮箱
		type: String,
		required: true
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

ManagerSchema.virtual('sSex').get(function(){
	switch(this.Sex){
		case 1: return '男';
		case 2: return '女';
		default: return '未知';
	}
});

ManagerSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

ManagerSchema.pre('save', function(next, done){
	next();
});

ManagerSchema.post('save', function(){
});

ManagerSchema.statics.findUsers = function(pagination, cb) {
	pagination[0] = pagination[0] || 1;

	this.find(null, null, {
		sort: {
			CreateTime: -1
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
ManagerSchema.statics.register = function(newInfo, cb) {
	var valiResu = mgrAddFrm.validate(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	newInfo.UserName = newInfo.UserName.toLowerCase();

	var that = this;

	that.findUserByUserName(newInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, 3, ['用户名已经存在', 'UserName'], doc);

		/* 数据入库 */
		newInfo.Id = util.uuid(false);
		newInfo.CreateTime = new Date();
		newInfo.IsDel = 0;
		newInfo.UserPass = md5.hex('123456');

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, null, doc);
		});
	});
};

/**
 *
 * @method 后台管理登陆
 * @params 
 * @return 
 */
ManagerSchema.statics.login = function(logInfo, cb) {
	var valiResu = mgrLoginFrm.validate(logInfo);
	if(valiResu) return cb(null, 0, valiResu);

	this.findUserByUserName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'UserName']);
		if(doc.IsDel) return cb(null, 4, ['找不到该用户。', 'UserName'], doc);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass) return cb(null, 5, ['用户名或密码输入错误。', 'UserPass'], doc);
		cb(null, 1, '登陆成功', doc);
	});
};

ManagerSchema.statics.findMenuTree = function(user_id, cb) {
	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @method 通过用户名查找用户
 * @params userName 用户名
 * @return 
 */
ManagerSchema.statics.findUserByUserName = function(userName, cb) {
	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

ManagerSchema.statics.findUserById = function(id, cb) {
	this.findOne({
		Id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var ManagerModel = mongoose.model('manager', ManagerSchema);

exports = module.exports = ManagerModel;