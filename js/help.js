$(document).ready(function () {
	$(".desplegable").click(function (e) {
		e.preventDefault();
		$(e.target).toggleClass("active");
		let panel = $(e.target).next();
		$(panel).toggle(450);
	});

	generarBotones();
	abrirAyuda();
});

//FUNCION QUE LLAMA A LA API MEDIANTE METODO GET PARA OBTENER LAS AYUDAS 
async function getAllHelps() {
	let result;
	try {
		result = await $.ajax({
		type: "GET",
		url: "https://proyectodaw-api.herokuapp.com/helps",
		success: function (data) {
			result = data;
		},
		});
		return result;
	} catch (error) {
		console.error(error);
	}
};
let ayudas;


//FUNCION QUE CREA LOS BOTONES 

function generarBotones() {
	getAllHelps().then((data) => {
		ayudas = data;	
		let output = "";
		ayudas.forEach((categoria) => {
			output += '<div class="caja" id='+categoria.titulo.replace(/ /g, "")+ '>' + categoria.titulo + "</div>";
		});
		$("#container").css("display","");
		$(".desplegable").css("display","");
		$("#contenido").css("display","none");
		$("#container").html(output);
		
	});
}

//FUNCION QUE MUESTRA EL CONTENIDO DE LAS AYUDAS
function mostrarContenido(id){
	getAllHelps().then((data) => {
		ayudas = data;
		let output= "";
		let i;
		ayudas.forEach((categoria)=> {
			if(id==categoria.titulo){
				for(i=0;i<categoria.contenido.length;i++){
					output+="<h1>"+categoria.contenido[i].subtitulo.charAt(0).toUpperCase()+categoria.contenido[i].subtitulo.slice(1)+"</h1>";
					output+="<p>"+categoria.contenido[i].explicacion.charAt(0).toUpperCase()+categoria.contenido[i].explicacion.slice(1)+"</p>";
				}
				output += "<div class='botonera'><button class='boton' id='back'>VOLVER</button></div>";
				
			}
		});
		$("#contenido").html(output);

		$("#back").click(function (e) {
			location.reload();
			generarBotones();
		});
	});

}

//FUNCION QUE MUESTRA EL CONTENIDO DE LAS AYUDAS DEPENDIENDO DE CUAL HA SIDO PULSADA
function abrirAyuda(){
	getAllHelps().then((data) => {
		ayudas = data;	
		ayudas.forEach((categoria) => {
			let id=categoria.titulo.replace(/ /g, "");
			$("#"+id).on("click",function(e){
				e.preventDefault();
				$("#container").css("display","none");
				$(".desplegable").css("display","none");
				$("#contenido").css("display","grid");
				mostrarContenido(categoria.titulo);

			});
		});

	});
};

