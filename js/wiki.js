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
		generarBotones(id);
	}

	function generarBotones(id){
		let elementos = [];
		switch(id){
			case "Enemigos":
				elementos = enemigos;
				break;
			case "Consumibles":
				elementos = consumibles;
				break;
			case "Equipo":
				elementos = equipo;
				break;
			default:
			case "Habilidades":
				elementos = habilidades;
				break;
		};
		let output = "<div class=\"grid-container\">";
		elementos.forEach(elemento => {
			output += "<div class=\"caja\">" + elemento.nombre + "</div>";
		});
		output += "</div>";
		$("#" + id).html(output);
	};

});