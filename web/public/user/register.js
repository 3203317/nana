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
	$('#regFrm').olxForm('submit', [function(){}, null, function (data){
		if(!data.success) return showVali(data.msg);
		location.href = $('#regFrm_UserName').val().trim() +'/register/success';
	}]);
}

$('#btn_reg').click(subFrm);