var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

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
	DeviceType_Id: {	//Android, IPad, IPhone, Other
		type: String,
		default: 'Android'
	},
	DeviceName: {
		type: String,
		required: true
	},
	DeviceDesc: {
		type: String
	},
	DeviceVer: {
		type: String
	},
	IsLogin: {			//设备登陆1，退出为0
		type: Number
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
 * @method 判断设备Id号是否存在
 * @params 
 * @return 
 */
DeviceSchema.statics.isExist = function(device_id, cb) {
};

/**
 *
 * @method 设备登陆
 * @params logInfo
 * @return 
 */
DeviceSchema.statics.login = function(logInfo, cb) {
	logInfo.Id = util.uuid(false);
	logInfo.CreateTime = new Date();
	logInfo.IsLogin = 1;

	this.create(logInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @method 设备登出
 * @params logInfo
 * @return 
 */
DeviceSchema.statics.logout = function(logInfo, cb) {
	logInfo.Id = util.uuid(false);
	logInfo.CreateTime = new Date();
	logInfo.IsLogin = 0;

	this.create(logInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var DeviceModel = mongoose.model('device', DeviceSchema);

exports = module.exports = DeviceModel;