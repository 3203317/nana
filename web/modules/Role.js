var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

var roleAddFrm = require('../public/manage/role/addFrm'),
	roleDelFrm = require('../public/manage/role/delFrm'),
	roleEditFrm = require('../public/manage/role/editFrm');

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

RoleSchema.statics.edit = function(newInfo, cb) {
	var valiResu = roleEditFrm.validate(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	newInfo.StartTime = new Date(newInfo.StartTime);
	newInfo.EndTime = new Date(newInfo.EndTime);
	delete newInfo.CreateTime;

	this.update({
		Id: newInfo.Id
	}, {
		'$set': newInfo
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 1, '编辑成功', count);
	});
};

RoleSchema.statics.findRoles = function(cb) {
	this.find(null, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

RoleSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = roleAddFrm.validate(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	newInfo.StartTime = new Date(newInfo.StartTime);
	newInfo.EndTime = new Date(newInfo.EndTime);

	var that = this;

	that.findRoleByRoleName(newInfo.RoleName, function (err, doc){
		if(err) return next(err);
		if(doc) return cb(null, 3, ['角色名称已经存在。', 'RoleName'], doc);

		newInfo.Id = util.uuid(false);
		newInfo.CreateTime = new Date();

		that.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, '新角色创建成功。', doc);
		});
	});
};

RoleSchema.statics.findRoleByRoleName = function(roleName, cb) {
	this.findOne({
		RoleName: roleName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

RoleSchema.statics.removes = function(data, cb) {
	var valiResu = roleDelFrm.validate(data);
	if(valiResu) return cb(null, 0, valiResu);
	
	this.remove({
		Id: {
			'$in': data.Ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 1, '删除成功', count);
	});
};

RoleSchema.statics.findRoleById = function(id, cb) {
	this.findOne({
		Id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var RoleModel = mongoose.model('role', RoleSchema);

exports = module.exports = RoleModel;