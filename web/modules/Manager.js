var db = require('./mongodb');
var util = require('../libs/utils');
var md5 = require('../libs/md5');
var Module = require('./Module');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var str1 = '用户名或密码不能为空';

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

	var para3 = {
		sort: {
			CreateTime: -1
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
ManagerSchema.statics.register = function(newInfo, cb) {
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	that.findUserByUserName(newInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if('object' === typeof doc) return cb(null, '用户名已经存在');
		/* 数据入库 */
		newInfo.Id = util.uuid(false);
		newInfo.UserName = newInfo.UserName.toLowerCase();
		newInfo.CreateTime = new Date();
		newInfo.IsDel = 0;
		newInfo.UserPass = md5.hex('123456');

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 后台管理登陆
 * @params 
 * @return 
 */
ManagerSchema.statics.login = function(userName, userPass, cb) {

	this.findUserByUserName(userName, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc) return cb(null, doc);
		if(md5.hex(userPass) !== doc.UserPass) return cb(null, '用户名或密码输入错误');
		cb(null, doc);
	});
};

ManagerSchema.statics.getMenuTree = function(userId, cb) {
	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function(err, docs){
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
	/* 用户名转换小写 */
	userName = userName.toLowerCase();

	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc ? doc : '没有找到该用户');
	});
};

var ManagerModel = mongoose.model('manager', ManagerSchema);

exports = module.exports = ManagerModel;