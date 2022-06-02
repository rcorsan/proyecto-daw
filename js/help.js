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



function generarBotones() {
	getAllHelps().then((data) => {
		ayudas = data;	
		let output = "";
		ayudas.forEach((categoria) => {
			console.log(categoria);
			output += '<div class="caja" id='+categoria.titulo.replace(/ /g, "")+ '>' + categoria.titulo + "</div>";
		});
		$("#container").html(output);
		
	});
}

function mostrarContenido(id){
	getAllHelps().then((data) => {
		ayudas = data;
		let output= "";
		let i;
		ayudas.forEach((categoria)=> {
			if(id==categoria.titulo){
				for(i=0;i<categoria.contenido.length;i++){
					console.log(categoria.contenido);
					output+="<h1>"+categoria.contenido[i].subtitulo.charAt(0).toUpperCase()+categoria.contenido[i].subtitulo.slice(1)+"</h1>";
					output+="<p>"+categoria.contenido[i].explicacion.charAt(0).toUpperCase()+categoria.contenido[i].explicacion.slice(1)+"</p>";
				}
				output += "<div class='botonera'><button class='boton' id='prev'>ANTERIOR</button> <button class='boton' id='back'>VOLVER</button> <button class='boton' id='next'>SIGUIENTE</button></div>";
				
			}
		});
		$("#contenido").html(output);
	});

}

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
