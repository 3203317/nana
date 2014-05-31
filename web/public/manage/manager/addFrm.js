function valiAddFrm(data){
	if(!data) return '参数异常';

	if(!data.UserName || !/^[\u4E00-\u9FA5\w]{1,10}$/.test(data.UserName)) return ['仅支持1-10位中文、数字、字母或下划线。', 'UserName'];
}

exports.validate = valiAddFrm;