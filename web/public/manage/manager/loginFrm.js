function valiLoginFrm(data){
	if(!data) return '参数异常';

	if(!data.UserName || !/^[a-zA-Z]\w{3,15}$/.test(data.UserName)) return ['支持4-16位字母、数字或下划线，首位不能是数字。', 'UserName'];

	if(!data.UserPass || !/^\w{6,20}$/.test(data.UserPass)) return ['密码不符合要求。', 'UserPass'];
}

exports.validate = valiLoginFrm;