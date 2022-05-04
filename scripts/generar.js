generarNav();

function generarNav(){
	const paginas = [
		{titulo:"Inicio",ref:"./"},
		{titulo:"Catálogos",ref:"./wiki"},
		{titulo:"Ayuda",ref:"./help"}
	];
	let titulo = document.title;
	let output = "";
	paginas.forEach(pagina => {
		if (titulo != pagina.titulo) {
			output += "<a href=\"";
			if (titulo != "Inicio") {
				//console.log(titulo);
				output += ".";
			}
			output += pagina.ref + "\"";
			if (pagina.titulo == "Ayuda") {
				output += " target=\"_blank\"";
			}
			output += ">" + pagina.titulo + "</a>";
		}
	});
	document.getElementById("topnav").innerHTML = output;
}
