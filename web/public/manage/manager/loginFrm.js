function valiLoginFrm(data){
	if(!data) return '参数异常';

	var result = /^[a-zA-Z0-9_]{4,16}$/.test(data.UserName);
	if(!result) return ['支持4-16位字母、数字或下划线，首位不能是数字。', 'UserName'];
	data.UserName = data.UserName.trim().toLowerCase();

	result = /^[a-zA-Z0-9_-]{6,20}$/.test(data.UserPass);
	if(!result) return ['密码不符合要求。', 'UserPass'];
}

exports.validate = valiLoginFrm;