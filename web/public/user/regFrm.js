function valiRegFrm(data){
	if(!data) return '参数异常';
	data.UserName = !!data.UserName ? data.UserName.trim() : '';
	if(!data.UserName.length) return ['电子邮箱不能为空。', 'UserName'];
	data.UserPass = !!data.UserPass ? data.UserPass.trim() : '';
	if(!data.UserPass.length) return ['登陆密码不能为空。', 'UserPass'];
	data.UserPass2 = !!data.UserPass2 ? data.UserPass2.trim() : '';
	if(!data.UserPass2.length) return ['确认密码不能为空。', 'UserPass2'];
	data.VerifyCode = !!data.VerifyCode ? data.VerifyCode.trim() : '';
	if(!data.VerifyCode.length) return ['验证码不能为空。', 'VerifyCode'];
}