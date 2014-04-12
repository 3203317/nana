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

/**
 *
 * @method 新增设备
 * @params 
 * @return 
 */
DeviceSchema.statics.saveNew = function(newInfo, cb) {
	if(!newInfo.DeviceId) return cb('设备Id不能为空');
	newInfo.DeviceId = newInfo.DeviceId.trim();
	if(0 === newInfo.DeviceId.length) return cb('设备Id不能为空');

	var that = this;

	this.findDeviceByUser(newInfo.User_Id, newInfo.DeviceId, function (err, doc){
		if(err){
			if('string' === typeof err){
				newInfo.Id = util.uuid(false);
				that.create(newInfo, function (err, doc){
					if(err) return cb(err);
					cb(null, doc);
				});
				return;
			}
			return cb(err);
		}
		cb('该设备已被注册');
	});
};

/**
 *
 * @method 查询用户单个设备
 * @params deviceId 设备唯一编号
 * @return 
 */
DeviceSchema.statics.findDeviceByUser = function(user_id, deviceId, cb) {
	if(!deviceId) return cb('设备Id不能为空');
	deviceId = deviceId.trim();
	if(0 === deviceId.length) return cb('设备Id不能为空');

	if(!user_id) return cb('用户Id不能为空');
	user_id = user_id.trim();
	if(0 === user_id.length) return cb('用户Id不能为空');

	var para1 = {
		DeviceId: deviceId,
		User_Id: user_id
	};

	this.findOne(para1, null, null, function (err, doc){
		if(err) return next(err);
		if(doc) return cb(null, doc);
		cb('找不到该设备');
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