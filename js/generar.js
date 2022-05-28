$( document ).ready(function() {
	generarNav();
	generarFooter();

});

let href = document.location.href;

function generarNav(){
	const paginas = [
		{titulo:"Inicio",ref:""},
		{titulo:"Catálogos",ref:"wiki/"},
		{titulo:"Ayuda",ref:"help/"}
	];
	let titulo = document.title;
	let output = "";
	paginas.forEach(pagina => {
		if (titulo == pagina.titulo) {
			href = href.replace(pagina.ref,"");
			console.log(href);
		}else console.log(href+"a");
	});
	paginas.forEach(pagina => {
		if (titulo != pagina.titulo) {
			output += "<a href=\"" + href + pagina.ref + "\"";
			if (pagina.titulo == "Ayuda") {
				output += " target=\"_blank\"";
			}
			output += ">" + pagina.titulo + "</a>";
		}
	});
	$("#topnav").html(output);
}//función que genera la barra de navegacion

function generarFooter(){
	let output = "<p>Proyecto 2º de grado superior de Desarrollo de Aplicaciones Web (<i>Raquel Corporales Sánchez y Víctor Talavera Moreno</i>) IES Barajas</p>";
	output += "<p>Imágenes provenientes de <a href='https://game-icons.net/about.html#authors'>game-icons.net</a>.</p>";
	$("#footer").html(output);
}//función que genera el pie