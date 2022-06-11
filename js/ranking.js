let pagina=0;

$(document).ready(function () {
	generarRanking();
});

//FUNCION QUE HACE LLAMADA GET A LA API PARA OBTENER TODOS LOS USUARIOS 
async function getAllUsers() {
	let result;
	try {
		result = await $.ajax({
		type: "GET",
		url: "https://proyectodaw-api.herokuapp.com/users",
		success: function (data) {
			result = data;
		},
		});
		return result;
	} catch (error) {
		console.error(error);
	}
};

//FUNCION QUE CREA EL RANKING
function generarRanking() {
	getAllUsers().then((data) => {
		let users = data;	
		//ORDENA LOS USUARIOS DE MAYOT A MENOR DEPENDIENDO DE SU MAXIMA PUNTUACION
        users.sort(function(a, b) {
            let textA = a.session.maxScore;
            let textB = b.session.maxScore;
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
		//CREACION DE LA TABLA QUE MUESTRA LOS USUARIOS DE CINCO EN CINCO Y BOTONES PARA NAVEGAR ENTRE ELLOS
		let output = "<table>";
        output +="<thead><tr><th>Posición</th><th>User</th><th>Puntuación máxima</th></tr></thead><tbody>"; 
		let posicion=0;
		let prev = false;
		let next = false;
		users.forEach((user) => {
			posicion++;
			if(pagina * 5 < posicion && posicion <= pagina * 5 + 5){
				output += "<tr";
				output += (posicion==1)?(" class='oro'"):("");
				output += (posicion==2)?(" class='plata'"):("");
				output += (posicion==3)?(" class='bronce'"):("");
				output += "><th>"+posicion+"</th><th>"+user.name+"</th><th>"+user.session.maxScore+"</th></tr>";
			}else{
				if(posicion<= pagina * 5){
					prev = true;
				}else{
					next = true;
				}
			}
		});
        output += "</tbody></table>";
		let botones = (prev)?("<button class='boton prev' id='prev'>ANTERIOR</button> "):"";
		botones += (next)?("<button class='boton next' id='next'>SIGUIENTE</button>"):"";
		$("#ranking").html(output);
		$("#botonera").html(botones);
		
		$(".prev").click(function (e) { 
			e.preventDefault();
			pagina += -1;
			generarRanking();
		});

		$(".next").click(function (e) { 
			e.preventDefault();
			pagina++;
			generarRanking();
		});


	});
}