var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

var ModuleSchema = new Schema({
	PId: {
		type: ObjectId
	},
	ModuleName: {
		type: String,
		required: true
	},
	ModuleUrl: {
		type: String
	},
	Sort: {
		type: Number,
		default: 1
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

ModuleSchema.virtual('sCreateTime').get(function(){
	return this.CreateTime.format();
});

ModuleSchema.pre('save', function (next, done){
	next();
});

ModuleSchema.post('save', function(){
});

mongoose.model('Module', ModuleSchema);