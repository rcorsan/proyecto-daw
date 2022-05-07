$( document ).ready(function() {

	$(".tablinks").click(function (e) { 
		e.preventDefault();
		abrirCatalogo(e);
	});

	function abrirCatalogo(e) {
		$(".tabcontent").css({"display" : "none"});
		$(".tablinks").removeClass("active");
		const id = $(e.target).text();
		$("#" + id).css({"display" : "block"});
		$(e.target).addClass("active");
	}

});