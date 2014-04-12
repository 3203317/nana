var db = require('./mongodb');
var util = require('../libs/utils');

var Device = require('./Device');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var DeviceLogSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	Device_Id: {
		type: String
	},
	Longitude: {
		type: String
	},
	Latitude: {
		type: String
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

DeviceLogSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

DeviceLogSchema.pre('save', function (next, done){
	next();
});

DeviceLogSchema.post('save', function(){
});

var str1 = '设备Id不能为空';
var str2 = '用户Id不能为空';
var str3 = '找不到该设备';

/**
 *
 * @method 通过设备Id获取日志记录(分页)
 * @params device_id 设备Id(必须)
 * @params startTime 开始时间
 * @params endTime 结束时间
 * @return 
 */
DeviceLogSchema.statics.findDeviceLogsByDeviceId = function(device_id, startTime, endTime, pagination, cb) {
	if(!device_id) return cb(str1);
	device_id = device_id.trim();
	if(0 === device_id.length) return cb(str1);

	pagination[0] = pagination[0] || 1;

	var para1 = {
		Device_Id: device_id
	};

	var para3 = {
		sort: {
			CreateTime: -1
		},
		skip: (pagination[0] - 1) * pagination[1],
		limit: pagination[1]
	};

	this.find(para1, null, para3, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

function valiAddForm(data){
	if(!data.DeviceId) return str1;
	data.DeviceId = data.DeviceId.trim();
	if(0 === data.DeviceId.length) return str1;
}

/**
 *
 * @method 新增设备日志
 * @params 
 * @return 
 */
DeviceLogSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiAddForm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	Device.isExist(newInfo.DeviceId, function (err, doc){
		if(err) return cb(err);
		
		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(next, doc);
		});
	});
};

function valiFindPara(data){
	if(!data.DeviceId) return str1;
	data.DeviceId = data.DeviceId.trim();
	if(0 === data.DeviceId.length) return str1;

	if(!data.User_Id) return str2;
	data.User_Id = data.User_Id.trim();
	if(0 === data.User_Id.length) return str2;
}

/**
 *
 * @method 查询单个设备
 * @params 
 * @return 
 */
DeviceLogSchema.statics.findDeviceByUser = function(para1, cb) {
	var valiResu = valiFindPara(para1);
	if(valiResu) return cb(valiResu);

	this.findOne(para1, null, null, function (err, doc){
		if(err) return next(err);
		if(doc) return cb(null, doc);
		cb(str3);
	});
};

/**
 *
 * @method 查询用户的全部设备
 * @params 
 * @return 
 */
DeviceLogSchema.statics.findDevicesByUserId = function(userId, cb) {
	var user_id = userId.trim();
	if(0 === user_id.length) return cb(str2);

	this.find({
		User_Id: user_id
	}, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var DeviceLogModel = mongoose.model('devicelog', DeviceLogSchema);

exports = module.exports = DeviceLogModel;