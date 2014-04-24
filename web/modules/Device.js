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
	IsLogin: {			//设备登陆1，退出为0
		type: Number
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
 * @method 设备登陆
 * @params 
 * @return 
 */
DeviceSchema.statics.deviceLogin = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	newInfo.IsLogin = 1;
	newInfo.CreateTime = new Date();

	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 设备退出
 * @params 
 * @return 
 */
DeviceSchema.statics.deviceLogout = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	newInfo.IsLogin = 0;
	newInfo.CreateTime = new Date();

	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 查询用户的全部设备登陆及退出记录
 * @params userId 用户Id
 * @return 
 */
DeviceSchema.statics.findLogsByUserId = function(userId, cb) {

	this.find({
		User_Id: userId
	}, null, {
		sort: {
			CreateTime: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @method 查询设备的全部登陆及退出记录
 * @params deviceId 设备Id
 * @return 
 */
DeviceSchema.statics.findLogsByDeviceId = function(deviceId, cb) {

	this.find({
		DeviceId: deviceId
	}, null, {
		sort: {
			CreateTime: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var DeviceModel = mongoose.model('device', DeviceSchema);

exports = module.exports = DeviceModel;