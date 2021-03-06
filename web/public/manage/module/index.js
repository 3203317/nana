$('.form_date').datetimepicker({
	language: 'zh-CN',
	weekStart: 1,
	todayBtn: 1,
	autoclose: 1,
	todayHighlight: 1,
	startView: 2,
	minView: 2,
	forceParse: 0
});

function dblClickExpand(treeId, treeNode) {
	return treeNode.level > 0;
}

var setting = {
	view: {
		dblClickExpand: dblClickExpand
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		beforeClick: function(treeId, treeNode) {
			var pid = treeNode.id;
			$('#addFrm_PId').val(pid);
			$('#table1').data('url', ['/manage/module/', pid, '/children'].join('')).olxGrid('loadData', [null, function (data){
				if(300 === data.responseJSON.code) top.location.href = '/manage/user/login';
			}]);
		}
	}
};

for(var m in modules){
	var module = modules[m];
	module.id = module.Id;
	module.pId = module.PId;
	module.name = module.ModuleName;
	module.file = module.ModuleUrl;
	module.open = true;
}

modules.push({
	id: '0',
	pid: 'root',
	name: '根 Root',
	open: true
});

$(function(){
	$.fn.zTree.init($('#modTree'), setting, modules);
});

$('#btn_edit').click(function(){
	var vals = $('#table1').olxGrid('getCheckedRowsValue', 1);
	if(1 !== vals.length) return $('#editAlertModal').modal();

	var id = vals[0];

	$.ajax({
		url: id,
		type: 'GET',
		dataType: 'json'
	}).done(function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);

		$('#editModal').modal();

		var data = data.data;
		$('#editFrm_Id').val(id);
		$('#editFrm_ModuleName').val(data[0].ModuleName);
		$('#editFrm_ModuleUrl').val(data[0].ModuleUrl);
		$('#editFrm_Sort').val(data[0].Sort);
		$('#editFrm_CreateTime').val(data[1].CreateTime);
		$('#editFrm_shadow_CreateTime').val(data[1].CreateTime);
	});
});

$('#delConfirmModal').on('show.bs.modal', function (e) {
	var vals = $('#table1').olxGrid('getCheckedRowsValue', 1);
	if(!vals.length) {
		$('#delAlertModal').modal();
		return e.preventDefault();
	}
})

/* 绑定删除按钮，弹出提示对话框或确认对话框 */
$('#btn_del').click(function(){
	$('#delConfirmModal').modal();
});

$('#addFrm_btn_submit').click(function(){
	$('#addFrm').olxForm('submit', [valiAddFrm, function (valiResu){
		if('string' === typeof valiResu){
			return alert(valiResu);
		}
		$('#addFrm_'+ valiResu[1]).olxFormInput('validate', valiResu);
	}, function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	}]);
});

$('#editFrm_btn_submit').click(function(){
	$('#editFrm').olxForm('submit', [valiEditFrm, function (valiResu){
		if('string' === typeof valiResu){
			return alert(valiResu);
		}
		$('#editFrm_'+ valiResu[1]).olxFormInput('validate', valiResu);
	}, function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	}]);
});

$('#delConfirmModal_btn_submit').click(function(){
	var selIds = $('#table1').olxGrid('getCheckedRowsValue', 1);
	var data = {
		Ids: selIds
	};
	var valiResu = valiDelFrm(data);
	if(valiResu) return alert(valiResu);

	$.ajax({
		url: 'del',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify(data)
		}
	}).done(function (data) {
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	});
});