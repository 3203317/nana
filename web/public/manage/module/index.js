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

			$("#table1").data('url', ['/manage/module/', pid, '/children'].join('')).olxGrid("loadData", [null, function (data){
				if(300 === data.responseJSON.code){
					top.location.href = '/manage/user/login';
				}
			}]);
		}
	}
};

for(var i=0; i<modules.length; i++){
	var module = modules[i];
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
	$.fn.zTree.init($("#modTree"), setting, modules);
});

$("#btn_edit").click(function(){
	var vals = $("#table1").olxGrid("getCheckedRowsValue", 1);
	if(1 !== vals.length) return $("#editAlertModal").modal();

	var id = vals[0];

	$.ajax({
		url: id,
		type: "GET",
		dataType: "json"
	}).done(function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);

		$("#editModal").modal();

		var data = data.data;
		$('#editFrm_Id').val(id);
		$('#editFrm_ModuleName').val(data[0].ModuleName);
		$('#editFrm_ModuleUrl').val(data[0].ModuleUrl);
		$('#editFrm_Sort').val(data[0].Sort);
		$('#editFrm_CreateTime').val(data[1].CreateTime);
		$('#editFrm_shadow_CreateTime').val(data[1].CreateTime);
	});
});

$("#delConfirmModal").on("show.bs.modal", function (e) {
	var vals = $("#table1").olxGrid("getCheckedRowsValue", 1);
	if(!vals.length) {
		$("#delAlertModal").modal();
		return e.preventDefault();
	}
})

/* 绑定删除按钮，弹出提示对话框或确认对话框 */
$("#btn_del").click(function(){
	$("#delConfirmModal").modal();
});

$('#addFrm_btn_submit').click(function(){
	$('#addFrm').olxForm('submit', function (data){
		if(data.code){
			if(300 === data.code){
				top.location.href = '/manage/user/login';
				return;
			}
		}

		if(data.success){
			location.reload();
		}else{
			alert(data.msg);
		}
	});
});

$('#editFrm_btn_submit').click(function(){
	$('#editFrm').olxForm('submit', function (data){
		if(data.code){
			if(300 === data.code){
				top.location.href = '/manage/user/login';
				return;
			}
		}

		if(data.success){
			location.reload();
		}else{
			alert(data.msg);
		}
	});
});

$('#delConfirmModal_btn_submit').click(function(){
	var selIds = $("#table1").olxGrid("getCheckedRowsValue", 1);
	if(!selIds.length) return;

	$.ajax({
		url: 'del',
		type: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify({
				Ids: selIds
			})
		}
	}).done(function (data) {
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	}).complete(function(){
	});
});