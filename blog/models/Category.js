var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	CateName: {
		type: String
	}, Intro: {
		type: String
	}, Count: {
		type: Number
	}, Sort: {
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

CategorySchema.virtual('PostTime').get(function(){
	return this._id.getTimestamp();
});

mongoose.model('Category', CategorySchema);