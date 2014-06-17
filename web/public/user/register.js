$('#img_VerifyCode').click(function(){
	showVerifyCode();
});

function showVerifyCode(){
	$('#img_VerifyCode').attr('src', '../public/user/verifyCode.jpg?t='+ new Date());
}

$(function(){
	showVerifyCode();
});

function showVali(valiResu){
	$('form label[id$="_Vali"]').each(function (i, label){
		$(label).parent().css('display', 'none');
	});
	if('string' === typeof valiResu) return alert(valiResu);
	$('#regFrm_'+ valiResu[1] +'_Vali').text(valiResu[0]).css('display', 'block').parent().css('display', 'block');
	$('#regFrm_'+ valiResu[1]).focus();
}

function subFrm(){
	$('#regFrm').olxForm('submit', [function(){
		if(!$('#regFrm_Email').val().trim().length) return ['电子邮箱不能为空。', 'Email'];
		if(!$('#regFrm_UserPass').val().trim().length) return ['登陆密码不能为空。', 'UserPass'];
		if($('#regFrm_UserPass').val() !== $('#regFrm_UserPass2').val()) return ['确认密码必须填写，且要匹配登陆密码。', 'UserPass2'];
		if(!$('#regFrm_VerifyCode').val().trim().length) return ['验证码不能为空。', 'VerifyCode'];
	}, function (valiResu){
		showVali(valiResu);
	}, function (data){
		if(!data.success) return showVali(data.msg);
		location.href = $('#regFrm_Email').val().trim() +'/register/success';
	}]);
}

$('#btn_reg').click(subFrm);