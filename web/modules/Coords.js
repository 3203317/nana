var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

var Device = require('./Device');

var CoordsSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	User_Id: {
		type: String
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
	Position: {
		type: String
	},
	/* 客户端创建时间 */
	ClientTime: {
		type: Date
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

CoordsSchema.virtual('sClientTime').get(function(){
	return util.formatDate(this.ClientTime);
});

CoordsSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

CoordsSchema.pre('save', function (next, done){
	next();
});

CoordsSchema.post('save', function(){
});

/**
 *
 * @method 通过设备Id获取日志记录(分页)
 * @params device_id 设备Id(必须)
 * @params startTime 开始时间
 * @params endTime 结束时间
 * @return 
 */
CoordsSchema.statics.findCoordssByDeviceId = function(device_id, startTime, endTime, pagination, cb) {
};

/**
 *
 * @method 通过用户Id获取日志记录(分页)
 * @params user_id
 * @params startTime 开始时间
 * @params endTime 结束时间
 * @return 
 */
CoordsSchema.statics.findCoordssByUserId = function(user_id, startTime, endTime, pagination, cb) {
};

/**
 *
 * @method 新增设备日志(单条)
 * @params 
 * @return 
 */
CoordsSchema.statics.saveNew = function(newInfo, cb) {
	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var CoordsModel = mongoose.model('coords', CoordsSchema);

exports = module.exports = CoordsModel;