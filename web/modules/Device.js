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
	var ct = this.CreateTime;
	return ct.getFullYear() +'/'+
			util.pdate(ct.getMonth()+1) +'/'+
			util.pdate(ct.getDate()) +' '+
			ct.getHours() +':'+
			util.pdate(ct.getMinutes()) +':'+
			util.pdate(ct.getSeconds());
});

DeviceSchema.pre('save', function(next, done){
	next();
});

DeviceSchema.post('save', function(){
});

DeviceSchema.statics.findDevices = function(pagination, cb) {
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

function valiAddForm(data){
	data.DeviceId = data.DeviceId.trim();

	if(0 === data.DeviceId.length){
		return '设备Id不能为空';
	}
}

DeviceSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiAddForm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	var para1 = {
		DeviceId: deviceId,
		User_Id: user_id
	};

	this.findDeviceByUser(para1, function (err, doc){
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
		cb('该设备已注册');
	});
};

function valiFindPara(data){
	data.DeviceId = data.DeviceId.trim();
	if(0 === data.DeviceId.length) return '设备Id不能为空';

	data.User_Id = data.User_Id.trim();
	if(0 === data.User_Id.length) return '用户Id不能为空';
}

DeviceSchema.statics.findDeviceByUser = function(para1, cb) {
	var valiResu = valiFindPara(para1);
	if(valiResu) return cb(valiResu);

	this.findOne(para1, null, null, function (err, doc){
		if(err) return next(err);
		if(doc) return cb(null, doc);
		cb('找不到该设备');
	});
};

var DeviceModel = mongoose.model('device', DeviceSchema);

exports = module.exports = DeviceModel;