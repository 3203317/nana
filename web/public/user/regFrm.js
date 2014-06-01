function valiRegFrm(data){
	if(!data) return '参数异常';

	if(!data.UserName || !/^[\w]{4,16}$/.test(data.UserName)) return ['仅支持1-10位中文、数字、字母或下划线。', 'UserName'];
}

exports.validate = valiRegFrm;