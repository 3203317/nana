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
	return this.StartTime.getFullYear() +'/'+
			util.pdate(this.StartTime.getMonth()+1) +'/'+
			util.pdate(this.StartTime.getDate()) +' '+
			this.StartTime.getHours() +':'+
			util.pdate(this.StartTime.getMinutes()) +':'+
			util.pdate(this.StartTime.getSeconds());
});

RoleSchema.virtual('sEndTime').get(function(){
	return this.EndTime.getFullYear() +'/'+
			util.pdate(this.EndTime.getMonth()+1) +'/'+
			util.pdate(this.EndTime.getDate()) +' '+
			this.EndTime.getHours() +':'+
			util.pdate(this.EndTime.getMinutes()) +':'+
			util.pdate(this.EndTime.getSeconds());
});

RoleSchema.virtual('sCreateTime').get(function(){
	return this.CreateTime.getFullYear() +'/'+
			util.pdate(this.CreateTime.getMonth()+1) +'/'+
			util.pdate(this.CreateTime.getDate()) +' '+
			this.CreateTime.getHours() +':'+
			util.pdate(this.CreateTime.getMinutes()) +':'+
			util.pdate(this.CreateTime.getSeconds());
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

RoleSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
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