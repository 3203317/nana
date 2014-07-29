var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var ArticleSchema = new Schema({
	Title: {
		type: String,
		required: true
	}, Abstracts: {		// 摘要
		type: String
	}, Content: {		// 文章内容
		type: String
	}, Tags: {
		type: String
	}, Keys: {			// 关键字
		type: String
	}, ViewCount: {
		type: Number,
		default: 0
	}, User_Id: {		// 用户Id
		type: ObjectId
	}, PostTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

ArticleSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

ArticleSchema.virtual('sPostTime').get(function(){
	return this.PostTime.format();
});

ArticleSchema.virtual('PostTime2Month').get(function(){
	return util.pdate(this.PostTime.getMonth()+1);
});

ArticleSchema.virtual('PostTime2Day').get(function(){
	return util.pdate(this.PostTime.getDate());
});

ArticleSchema.virtual('ViewCount2Money').get(function(){
	return util.threeSeparator(this.ViewCount);
});

ArticleSchema.pre('save', function (next, done){
	next();
});

ArticleSchema.post('save', function(){
});

mongoose.model('Article', ArticleSchema);