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
	var st = this.StartTime;
	return st.getFullYear() +'/'+
			util.pdate(st.getMonth()+1) +'/'+
			util.pdate(st.getDate()) +' '+
			st.getHours() +':'+
			util.pdate(st.getMinutes()) +':'+
			util.pdate(st.getSeconds());
});

RoleSchema.virtual('sEndTime').get(function(){
	var et = this.EndTime;
	return et.getFullYear() +'/'+
			util.pdate(et.getMonth()+1) +'/'+
			util.pdate(et.getDate()) +' '+
			et.getHours() +':'+
			util.pdate(et.getMinutes()) +':'+
			util.pdate(et.getSeconds());
});

RoleSchema.virtual('sCreateTime').get(function(){
	var ct = this.CreateTime;
	return ct.getFullYear() +'/'+
			util.pdate(ct.getMonth()+1) +'/'+
			util.pdate(ct.getDate()) +' '+
			ct.getHours() +':'+
			util.pdate(ct.getMinutes()) +':'+
			util.pdate(ct.getSeconds());
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

function valiSaveForm(data){
	data.RoleName = data.RoleName.trim();

	if(0 === data.RoleName.length){
		return '角色名称不能为空';
	}
}

RoleSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiSaveForm(newInfo);
	if(valiResu) return cb(valiResu);

	var that = this;

	this.findRoleByRoleName(data.RoleName, function (err, doc){
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
		cb('角色名已经存在');
	});
};

RoleSchema.statics.findRoleByRoleName = function(roleName, cb) {
	this.findOne({
		RoleName: roleName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, doc);
		cb('没有找到该角色');
	});
};

var RoleModel = mongoose.model('role', RoleSchema);

exports = module.exports = RoleModel;