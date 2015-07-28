/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

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
	return util.format(new Date(this._id.getTimestamp()));
});

TagSchema.virtual('PostTime').get(function(){
	return this._id.getTimestamp();
});

TagSchema.pre('save', function (next, done){
	next();
});

TagSchema.post('save', function(){
	// TODO
});

mongoose.model('Tag', TagSchema);