$( document ).ready(function() {
	setIcon();
	generarNav();
	generarFooter();

	$("#navLogo").click(function (e) {
		e.preventDefault();
		document.location.href = "https://rcorsan.github.io/proyecto-daw/";
	});
	//evento para mostrar el menú de cambio de imagen
	$("#navImg").click(function (e) { 
		e.preventDefault();
		if ($("#cambio-img").css('display')=="none"){
			$("#cambio-img").css('display','flex');
		} else {
			$("#cambio-img").css('display','none');
		}
	});
	//evento para cambiar la imagen
	$(".new-img").click(function (e) { 
		e.preventDefault();
		let session = JSON.parse(localStorage.getItem('session'));
		if ($(e.target).attr("alt")!=session.image) {
			session.image = $(e.target).attr("alt");
			localStorage.setItem('session', JSON.stringify(session));
			updateSession(session);
			location.reload();
		} else $("#cambio-img").css('display','none');
	});
	
});

/*
*ASIGNACION DE VARIABLES
*/
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

/*
*FUNCION QUE ESTABLECE EL ICONO DE LA PAGINA
*/
function setIcon(){
	let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconpath;
	document.getElementsByTagName('head')[0].appendChild(link);
}

/*
*FUNCION QUE CREA LA BARRA DE NAVEGACION 
*/
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
	//DEPENDIENDO DE SI LA SESION ESTA INICIADA O NO MUESTRA LO SIGUIENTE 
	if(sessionCompr()){
		let session = JSON.parse(localStorage.getItem('session'));
		let imagepath = "";
		if(titulo != "Inicio"){
			imagepath += ".";
		}
		imagepath += "./assets/000000/1x1/";
		
		output += "<img id=\"navImg\" class='rightNav' src=\"" + imagepath + session.image + "\" width=\"48px\" alt=\"profile image\" /> ";
		output += "<div class='rightNav' href=\"" + href + "" + "\"> " + session.name + "</div>";
		output += "<a class='rightNav' id='cerrarSesion' href=\"" + href + "\"> Cerrar Sesión</a>";
		output += "<div class='cambio-img' id='cambio-img'><div style='width: 100%; color: black;'><h1>CAMBIO DE IMAGEN DE PERFIL</h1></div>";
		let images = [
			"caro-asercion/prank-glasses.svg",
			"caro-asercion/frog-mouth-helm.svg",
			"caro-asercion/warlord-helmet.svg",
			"lorc/cowled.svg",
			"lorc/crowned-skull.svg",
			"lorc/fedora.svg",
			"lorc/cat.svg",
			"lorc/squid-head.svg",
			"delapouite/centurion-helmet.svg",
			"delapouite/bandit.svg",
			"delapouite/closed-barbute.svg",
			"carl-olsen/mite-alt.svg",
			"caro-asercion/axolotl.svg",
			"delapouite/rat.svg",
			"lorc/monkey.svg",
			"lorc/sad-crab.svg",
			"lorc/gluttonous-smile.svg",
			"lorc/fairy.svg",
			"lorc/evil-book.svg",
			"delapouite/spiked-dragon-head.svg",
			"lorc/beast-eye.svg",
			"lorc/scales.svg",
			"delapouite/g-clef.svg",
			"delapouite/dice-fire.svg",
			"lorc/sword-smithing.svg",
			"lorc/daggers.svg",
			"lorc/thrown-daggers.svg",
			"lorc/clover.svg",
			"lorc/cursed-star.svg",
			"lorc/transfuse.svg",
			"lorc/grab.svg",
			"delapouite/labrador-head.svg"
		];
		images.forEach(image => {
			output += "<img class='new-img' src=";
			if(document.title != "Inicio") output += ".";
			output += "./assets/000000/1x1/" + image + " alt=" + image;
			if (image == session.image) {
				output += " width='80px' style='border: 10px solid rgb(7, 2, 255); cursor: pointer;' />";
			}else output += " width='100px' style='cursor: pointer;' />";
		});
		output += "</div>";
	}else {
		output += "<a class='rightNav' href=\"" + href + "login/" + "\"> Iniciar Sesión</a>";
		output += "<a class='rightNav' href=\"" + href + "signup/" + "\"> Registrarse</a>";
	}
	$("#topnav").html(output);

	$('#cerrarSesion').click(function (e) { 
		e.preventDefault();
		let session = JSON.parse(localStorage.getItem('session'));
		cerrarSesion(session);
	});
}

/*
*FUNCION QUE GENERA EL PIE DE PAGINA
*/
function generarFooter(){
	let output = "<p>Proyecto 2º de grado superior de Desarrollo de Aplicaciones Web (<i>Raquel Corporales Sánchez y Víctor Talavera Moreno</i>) IES Barajas</p>";
	output += "<p>Imágenes e iconos provenientes de <a href='https://game-icons.net/about.html#authors' target='_blank'>game-icons.net</a>.</p>";
	$("#footer").html(output);
}

/*
*FUNCION QUE COMPRUEBA SI LA SESION ESTA INICIADA O NO 
*/
function sessionCompr(){
	let session = false;

    if(localStorage){
        if(localStorage.getItem('session') && localStorage.getItem('session').length>0){
            session = true;
        }else{
            session = false;
        }
    }else{
		session = false;
    }

	return session;
}

/*
*FUNCION QUE ELIMINA LA SESION ALMACENADA EN LOCAL STORAGE PARA CERRAR SESION
*/
function cerrarSesion(session) {
	updateSession(session).then((data)=>{
		localStorage.removeItem('session');
		generarNav();
	});
}

/*
*FUNCION QUE ACTUALIZA LA SESION ENVIANDO LA ACTUAL ALMACENADA EN LOCALSTORAGE A LA BBDD MEDIANTE UNA LLAMADA POST A LA API 
*/
async function updateSession(params) {
	let result;
	try {
        result = await $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://proyectodaw-api.herokuapp.com/session",
            data: JSON.stringify(params),
            success: function (data) {
                result = data;
            },
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}