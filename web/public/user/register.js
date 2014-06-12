$('#img_VerifyCode').click(function(){
	showVerifyCode();
});

function showVerifyCode(){
	var widget = $('#img_VerifyCode');
	var oldSrc = widget.attr('src');
	widget.attr('src', oldSrc +'?t='+ new Date());
}

$(function(){
	showVerifyCode();
});

$('#btn_reg').click(function(){
	var formObj = $("#regFrm").serializeObjectForm();
	var valiResu = valiUserRegFrm(formObj);
	if(valiResu){
		if('string' === typeof valiResu){
			$('#alert_msg').html(valiResu);
		}else{
			$('#alert_msg').html(valiResu[0]);
			$('#regFrm_'+ valiResu[1]).focus();
		}
		return;
	}

	$.ajax({
		url: '/user/register',
		type: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify(formObj)
		}
	}).done(function(responseText) {
		var msg, lab;
		if(responseText.success){
			location.href = formObj.UserName +'/register/success';
		}else{
			msg = responseText.msg;
			if(msg.message) return $('#alert_msg').html(msg.message);

			if('string' === msg) return $('#alert_msg').html(msg);

			$('#alert_msg').html(msg[0]);

			lab = $('#regFrm_'+ msg[1]);
			if(lab[0]) lab.focus();
		}
	}).complete(function(){
	});
});