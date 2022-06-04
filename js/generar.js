$( document ).ready(function() {
	setIcon();
	generarNav();
	generarFooter();

	$("#navLogo").click(function(){
		document.location.href = "https://rcorsan.github.io/proyecto-daw/";
	});

	/*let objeto = {"mm":"aaa"};

	getPrincipal(objeto).then((data) => {
		console.info('Response:', data)
	})*/
	
});

/*async function getPrincipal(params){
	let result;
	try{
		result = await $.ajax({
			type: "POST",
			url: "https://proyectodaw-api.herokuapp.com/",
			data: JSON.stringify(params),
			success: function (data) {
				console.log(data);
				result = data;
			},
		});
		return result;
	} catch (error) {
		console.error(error);
	}	
}*/

//funcion que llama a post



let titulo = document.title;
let href = document.location.href;
const images = [
	{autor:"lorc", title:"drink-me.png"}, 
	{autor:"delapouite", title:"sword-brandish.png"}, 
	{autor:"lorc", title:"spectre.png"}, 
	{autor:"lorc", title:"tattered-banner.png"}, 
	{autor:"delapouite", title:"crypt-entrance.png"}
];
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
}//función que establece el icono de la página

function generarNav(){
	const paginas = [
		{titulo:"Inicio",ref:""},
		{titulo:"Catálogos",ref:"wiki/"},
		{titulo:"Ranking",ref:"ranking/"},
		{titulo:"Ayuda",ref:"help/"}
	];
	
	let output = "<img id=\"navLogo\" src=\"" + iconpath;
	output += "\" width=\"48px\" alt=\"logo\" />";
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
	if(sessionCompr()){
		let session = JSON.parse(sessionStorage.getItem('session'));
		let imagepath = "";
		if(titulo != "Inicio"){
			imagepath += ".";
		}
		imagepath += "./assets/000000/1x1/";
		
		output += "<img id=\"navImg\" class='rightNav' src=\"" + imagepath + session.image + "\" width=\"48px\" alt=\"profile image\" /> ";
		output += "<div class='rightNav' href=\"" + href + "" + "\"> " + session.name + "</div>";
		output += "<a class='rightNav' href=\"" + href + "" + "\" onClick=\"sessionStorage.removeItem('session')\"> Cerrar Sesión</a>";
	}else {
		output += "<a class='rightNav' href=\"" + href + "login/" + "\"> Iniciar Sesión</a>";
		output += "<a class='rightNav' href=\"" + href + "signup/" + "\"> Registrarse</a>";
	}
	$("#topnav").html(output);
}//función que genera la barra de navegacion

function generarFooter(){
	let output = "<p>Proyecto 2º de grado superior de Desarrollo de Aplicaciones Web (<i>Raquel Corporales Sánchez y Víctor Talavera Moreno</i>) IES Barajas</p>";
	output += "<p>Imágenes e iconos provenientes de <a href='https://game-icons.net/about.html#authors' target='_blank'>game-icons.net</a>.</p>";
	$("#footer").html(output);
}//función que genera el pie

function sessionCompr(){
	let session = false;

    if(sessionStorage){
        if(sessionStorage.getItem('session') && sessionStorage.getItem('session').length>0){
            session = true;
        }else{
            session = false;
        }
    }else{
		session = false;
    }

	return session;
}