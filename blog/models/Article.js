var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var ArticleSchema = new Schema({
	Title: {
		type: String
	},
	Abstracts: {		// 摘要
		type: String
	},
	Content: {			// 文章内容
		type: String
	},
	Keys: {				// 关键字
		type: String
	},
	User_Id: {			// 用户Id
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

ArticleSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

ArticleSchema.pre('save', function (next, done){
	next();
});

ArticleSchema.post('save', function(){
});

mongoose.model('Article', ArticleSchema);