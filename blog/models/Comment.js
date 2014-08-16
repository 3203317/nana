var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	Content: {			// 内容
		type: String
	}, PostIP: {		// 提交IP
		type: String
	}, Author: {		// 作者
		type: String
	}, Author_Id: {
		type: String
	}, Author_Url: {
		type: String
	}, User_Id: {		// 用户Id
		type: ObjectId
	}, Article_Id: {	// 文章Id
		type: ObjectId
	}, PostTime: {
		type: Date
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

mongoose.model('Comment', CommentSchema);