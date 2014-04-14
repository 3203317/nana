var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var DeviceSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	DeviceId: {
		type: String,
		required: true
	},
	DeviceName: {
		type: String,
		required: true
	},
	DeviceDesc: {
		type: String
	},
	DeviceType_Id: {	//Android, IPad, IPhone, Other
		type: String
	},
	DeviceVer: {
		type: String
	},
	User_Id: {
		type: String
	},
	Status: {
		type: Number,
		default: 1
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

DeviceSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

DeviceSchema.pre('save', function (next, done){
	next();
});

DeviceSchema.post('save', function(){
});

/**
 *
 * @method 监测设备是否存在
 * @params 
 * @return 
 */
DeviceSchema.statics.isExist = function(id, cb) {
	if(!id) return cb('设备Id不能为空');
	id = id.trim();
	if(0 === id.length) return cb('设备Id不能为空');

	this.findOne({
		Id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, doc);
		cb('没有找到该设备');
	});
};

DeviceSchema.statics.findDevices = function(pagination, cb) {
	pagination[0] = pagination[0] || 1;

	var para3 = {
		sort: {
			CreateTime: -1
		},
		skip: (pagination[0] - 1) * pagination[1],
		limit: pagination[1]
	};

	this.find(null, null, para3, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

function valiRegFrm(data){
	if(!data.DeviceId) return '设备Id不能为空';
	data.DeviceId = data.DeviceId.trim();
	if(0 === data.DeviceId.length) return '设备Id不能为空';

	if(!data.User_Id) return '用户Id不能为空';
	data.User_Id = data.User_Id.trim();
	if(0 === data.User_Id.length) return '用户Id不能为空';
}

/**
 *
 * @method 注册设备
 * @params 
 * @return 
 */
DeviceSchema.statics.register = function(newInfo, cb) {
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	that.findDeviceByUser(newInfo.User_Id, newInfo.DeviceId, function (err, doc){
		if(err) return cb(err);
		if('string' === typeof doc){
			newInfo.Id = util.uuid(false);
			that.create(newInfo, function (err, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
			return;
		}
		/* 设置曾经注册设备的状态启用 */
		that.setStatusEnable(doc.Id, function (err, doc){
			if(err) return cb(err);
			cb(null, doc);
		});
	});
};

/**
 *
 * @method 查询用户单个设备
 * @params deviceId 设备唯一编号
 * @return 
 */
DeviceSchema.statics.findDeviceByUser = function(user_id, deviceId, cb) {
	if(!deviceId) return '设备Id不能为空';
	deviceId = deviceId.trim();
	if(0 === deviceId.length) return '设备Id不能为空';

	if(!user_id) return '用户Id不能为空';
	user_id = user_id.trim();
	if(0 === user_id.length) return '用户Id不能为空';

	var para1 = {
		DeviceId: deviceId,
		User_Id: user_id
	};

	this.findOne(para1, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc ? doc : '找不到该设备');
	});
};

/**
 *
 * @method 设置单个设备状态启用
 * @params 
 * @return 
 */
DeviceSchema.statics.setStatusEnable = function(id, cb) {
	if(!id) return '主键Id不能为空';
	id = id.trim();
	if(0 === id.length) return '主键Id不能为空';

	this.update({
		Id: id
	}, {
		'$set': {
			Status: 1
		}
	}, function (err, doc){
		if(err) return next(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 设置单个设备状态禁用
 * @params 
 * @return 
 */
DeviceSchema.statics.setStatusDisable = function(id, cb) {
	if(!id) return '主键Id不能为空';
	id = id.trim();
	if(0 === id.length) return '主键Id不能为空';

	this.update({
		Id: id
	}, {
		'$set': {
			Status: 2
		}
	}, function (err, doc){
		if(err) return next(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 查询用户的全部设备
 * @params 
 * @return 
 */
DeviceSchema.statics.findDevicesByUserId = function(userId, cb) {
	if(!userId) return cb('用户Id不能为空');
	var user_id = userId.trim();
	if(0 === user_id.length) return cb('用户Id不能为空');

	this.find({
		User_Id: user_id
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var DeviceModel = mongoose.model('device', DeviceSchema);

exports = module.exports = DeviceModel;