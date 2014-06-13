function valiRegFrm(data){
	if(!data) return '参数异常';
	if(!data.UserName || !/^[\w]{4,16}$/.test(data.UserName)) return ['仅支持1-10位中文、数字、字母或下划线。', 'UserName'];
	if(!data.UserPass || !/^[\w]{4,16}$/.test(data.UserPass)) return ['登陆密码不能为空。', 'UserPass'];
	if(!data.UserPass2 || !/^[\w]{4,16}$/.test(data.UserPass2)) return ['确认密码不能为空。', 'UserPass2'];
	if(!data.VerifyCode || !/^[\w]{4,16}$/.test(data.VerifyCode)) return ['验证码不能为空。', 'VerifyCode'];
}

exports.validate = valiRegFrm;