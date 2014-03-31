$(document).ready(function(){
	console.log("Hello, World!");

	$(".flexslider").flexslider({
		animation: "slide"
	});

	$("#qrcode").pin({
		minWidth: 940,
		top: 60
	})
	
	$("#loadMore").click(function(){
        var that = this;
        var $that = $(that);
        var text = $that.text();
        $that.text("努力加载中...");
        var currentPage = $that.data("current-page") + 1;
        var data = { data: JSON.stringify({ Current: currentPage }) };
        
        $.ajax({
			url: $().olxUtilRandomUrl($that.data("url")),
			type: "GET",
			dataType: "html",
			data: data
		}).done(function(responseText) {
		    if("" != $.trim(responseText)){		    
                $that.data("current-page", currentPage);		    
			    $("#articleIntros").append(responseText);
		    }			
		}).complete(function(){
            $that.text(text);
		});
	});
});