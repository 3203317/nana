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
	}, TagCount: {
		type: Number
	}, User_Id: {		// 用户Id
		type: ObjectId
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

TagSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

TagSchema.pre('save', function (next, done){
	next();
});

TagSchema.post('save', function(){
});

mongoose.model('Tag', TagSchema);