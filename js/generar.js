$( document ).ready(function() {
	setIcon();
	generarNav();
	generarFooter();

	$("#navLogo").click(function(){
		document.location.href = "https://rcorsan.github.io/proyecto-daw/";
	});
});

let titulo = document.title;
let href = document.location.href;
const images = [{autor:"lorc", title:"drink-me.png"}, {autor:"delapouite", title:"sword-brandish.png"}, {autor:"lorc", title:"spectre.png"}];
let random = Math.floor(Math.random()*(images.length));
let logo = images[random];

let iconpath = "";
if(titulo != "Inicio"){
	iconpath += ".";
}
iconpath += "./assets/transparent/1x1/"+logo.autor+"/"+logo.title;

function setIcon(){
	let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconpath;
	document.getElementsByTagName('head')[0].appendChild(link);
}

function generarNav(){
	const paginas = [
		{titulo:"Inicio",ref:""},
		{titulo:"Catálogos",ref:"wiki/"},
		{titulo:"Ayuda",ref:"help/"}
	];
	
	let output = "<img id=\"navLogo\" src=\"" + iconpath;
	output += "\" width=\"48px\" alt=\"logo\" >";
	paginas.forEach(pagina => {
		if (titulo == pagina.titulo) {
			href = href.replace(pagina.ref,"");
		}
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
	output += "<p>Imágenes provenientes de <a href='https://game-icons.net/about.html#authors' target='_blank>game-icons.net</a>.</p>";
	$("#footer").html(output);
}//función que genera el pie