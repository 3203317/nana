var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var TagSchema = new Schema({
	TagName: {
		type: String,
		required: true,
		unique: true,
		index: true
	}, Count: {
		type: Number
	}, User_Id: {		// 用户Id
		type: ObjectId
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

TagSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

TagSchema.virtual('PostTime').get(function(){
	return this._id.getTimestamp();
});

TagSchema.pre('save', function (next, done){
	next();
});

TagSchema.post('save', function(){
});

mongoose.model('Tag', TagSchema);