$('#img_VerifyCode').click(function(){
	showVerifyCode();
});

function showVerifyCode(){
	$('#img_VerifyCode').attr('src', '../public/user/verifyCode.jpg?t='+ new Date());
}

$(function(){
	showVerifyCode();
});

$('#btn_reg').click(function(){
	$('#regFrm').olxForm('submit', [valiRegFrm, function (valiResu){
		$('form label[id$="_Vali"]').each(function (i, label){
			$(label).parent().css('display', 'none');
		});
		if('string' === typeof valiResu) return alert(valiResu);
		$('#regFrm_'+ valiResu[1] +'_Vali').text(valiResu[0]).css('display', 'block').parent().css('display', 'block');
		$('#regFrm_'+ valiResu[1]).focus();
	}, function (data){
		console.log(data);
	}]);

	// var formObj = $("#regFrm").serializeObjectForm();
	// var valiResu = valiUserRegFrm(formObj);
	// if(valiResu){
	// 	if('string' === typeof valiResu){
	// 		$('#alert_msg').html(valiResu);
	// 	}else{
	// 		$('#alert_msg').html(valiResu[0]);
	// 		$('#regFrm_'+ valiResu[1]).focus();
	// 	}
	// 	return;
	// }

	// $.ajax({
	// 	url: '/user/register',
	// 	type: "POST",
	// 	dataType: "json",
	// 	data: {
	// 		data: JSON.stringify(formObj)
	// 	}
	// }).done(function(responseText) {
	// 	var msg, lab;
	// 	if(responseText.success){
	// 		location.href = formObj.UserName +'/register/success';
	// 	}else{
	// 		msg = responseText.msg;
	// 		if(msg.message) return $('#alert_msg').html(msg.message);

	// 		if('string' === msg) return $('#alert_msg').html(msg);

	// 		$('#alert_msg').html(msg[0]);

	// 		lab = $('#regFrm_'+ msg[1]);
	// 		if(lab[0]) lab.focus();
	// 	}
	// }).complete(function(){
	// });
});