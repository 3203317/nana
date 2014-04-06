/**
 * 作者：黄鑫
 * 日期：2013-07-16
 * 描述：系统主界面
 */
var console = console||{log:function(){return;}}
require.config(config);
require(["jquery",
	"MenuTree",
	"router",
	"backbone",
	"dhtmlxlayout"], function($, $MenuTree, $router, $backbone){	
	/* Loader */
	var _div_loader = $("#div_loader");
	/* 退出超链接 */
	var _a_quit = $("#a_quit");

	$(document).ready(function(){
		/* 退出注册事件 */
		_a_quit.click(function(){
			console.log("退出");
		});

		/* 主框架布局 */
		var __layout = new dhtmlXLayoutObject({
			parent: "div_center",
			pattern: "2U",
			cells: [{
				id: "a",
				text: "menuTree",
				width: 220,
				header: false
			},{
				id: "b",
				text: "mainTabs",
				header: false
			}]
        });
		/* 设置布局自动大小的部位 */
		//__layout.setAutoSize("a;d", "b;c");
		/* 调整布局时的效果 */
		//__layout.setEffect("resize", true);
		/* 添加头和尾*/
		//__layout.attachFooter("div_foot");
		//__layout.attachHeader("div_head");
		/* 导航页加入到主框架中 */
		__layout.cells("b").attachObject("ifr_mainTabs");
		__layout.cells("a").attachObject("div_tree");
		/* 设置第a个样式的border为0 */
		$(".dhxcont_global_content_area:first").css({border:0});

		/* 创建左侧菜单树 */
		var __menuTree = new $MenuTree({
			placeAt: "div_tree" //__layout.cells("a").attachTabbar()
		});

		/* 菜单树的点击事件触发 */
		__menuTree.onClick(function($params){ location.href = "#page/"+ $params.href; });
		
		/* 路由功能 */
		var __router = new $router();
		$backbone.history.start();

		/* 页面resize重绘 */
		var __setSizes = function(){
			__layout.setSizes();
			__menuTree.setSizes();
		}
		$(window).resize(function(){ setTimeout(__setSizes, 10); });
		/* 布局resize */
		__layout.attachEvent("onPanelResizeFinish", __setSizes);
		/* 页面加载效果 */
		_div_loader[0].firstChild.innerHTML += " done.";
		setTimeout(function(){ _div_loader.fadeOut(500); },250);
		__setSizes();
	});
},function($err){    
	var _failedId = $err.requireModules && $err.requireModules[0];
    if (_failedId === "jquery"){
        requirejs.undef(_failedId);
    }
});