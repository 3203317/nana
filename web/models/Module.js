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
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

ModuleSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

ModuleSchema.pre('save', function (next, done){
	next();
});

ModuleSchema.post('save', function(){
});

mongoose.model('Module', ModuleSchema);