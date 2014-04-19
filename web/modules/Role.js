var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var RoleSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	RoleName: {
		type: String,
		required: true
	},
	RoleDesc: {
		type: String
	},
	StartTime: {
		type: Date
	},
	EndTime: {
		type: Date
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

RoleSchema.virtual('sStartTime').get(function(){
	return util.formatDate(this.StartTime);
});

RoleSchema.virtual('sEndTime').get(function(){
	return util.formatDate(this.EndTime);
});

RoleSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

RoleSchema.pre('save', function(next, done){
	next();
});

RoleSchema.post('save', function(){
});

RoleSchema.statics.findRoles = function(cb) {
	this.find(null, null, null, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

function valiRegFrm(data){
	if(!data.RoleName) return '角色名称不能为空';
	data.RoleName = data.RoleName.trim();
	if(0 === data.RoleName.length) return '角色名称不能为空';

	data.StartTime = new Date(data.StartTime);
	data.EndTime = new Date(data.EndTime);
}

RoleSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiRegFrm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	that.findRoleByRoleName(newInfo.RoleName, function (err, doc){
		if(err) return next(err);
		if('string' === typeof doc){
			newInfo.Id = util.uuid(false);
			newInfo.CreateTime = new Date();
			that.create(newInfo, function (err, doc){
				if(err) return cb(err);
				cb(null, doc);
			});
			return;
		}
		cb(null, '角色名称已经存在');
	});
};

RoleSchema.statics.findRoleByRoleName = function(roleName, cb) {
	if(!roleName) return cb('角色名称不能为空');
	roleName = roleName.trim();
	if(0 === roleName.length) return cb('角色名称不能为空');

	this.findOne({
		RoleName: roleName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc ? doc : '没有找到该角色');
	});
};

var RoleModel = mongoose.model('role', RoleSchema);

exports = module.exports = RoleModel;