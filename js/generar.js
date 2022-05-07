$( document ).ready(function() {

	generarNav();

	function generarNav(){
		const paginas = [
			{titulo:"Inicio",ref:"./"},
			{titulo:"Catálogos",ref:"./wiki.html"},
			{titulo:"Ayuda",ref:"./help.html"}
		];
		let titulo = document.title;
		let output = "";
		paginas.forEach(pagina => {
			if (titulo != pagina.titulo) {
				output += "<a href=\""  + pagina.ref + "\"";
				if (pagina.titulo == "Ayuda") {
					output += " target=\"_blank\"";
				}
				output += ">" + pagina.titulo + "</a>";
			}
		});
		$("#topnav").html(output);
	}

});