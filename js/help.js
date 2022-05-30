$(document).ready(function () {
	$(".desplegable").click(function (e) {
		e.preventDefault();
		$(e.target).toggleClass("active");
		let panel = $(e.target).next();
		$(panel).toggle(450);
	});

	generarBotones();
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
			output += '<div class="caja" >' + categoria.titulo + "</div>";
		});
		$("#container").html(output);
	});
}
