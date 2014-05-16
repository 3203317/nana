function valiLoginFrm(data){
	if(!data) return '参数异常';

<<<<<<< HEAD
	if(!data.UserName || !/^[a-zA-Z]\w{3,15}$/.test(data.UserName)) return ['支持4-16位字母、数字或下划线，首位不能是数字。', 'UserName'];

	if(!data.UserPass || !/^\w{6,20}$/.test(data.UserPass)) return ['密码不符合要求。', 'UserPass'];
=======
	var result = /^[a-zA-Z0-9_]{4,16}$/.test(data.UserName);
	if(!result) return ['支持4-16位字母、数字或下划线，首位不能是数字。', 'UserName'];
	data.UserName = data.UserName.trim().toLowerCase();

	result = /^[a-zA-Z0-9_-]{6,20}$/.test(data.UserPass);
	if(!result) return ['密码不符合要求。', 'UserPass'];
>>>>>>> fcc55d7bb512899ca1fc915e751c853dacbb4a6b
}

exports.validate = valiLoginFrm;