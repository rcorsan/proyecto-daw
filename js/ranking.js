$(document).ready(function () {
	generarRanking();
	generarcss();
});

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

function generarRanking() {
	getAllUsers().then((data) => {
		users = data;	
        users.sort(function(a, b) {
            var textA = a.maxScore;
            var textB = b.maxScore;
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
		let output = "<table>";
        output +="<thead><tr><th>Posición</th><th>User</th><th>Puntuación máxima</th></tr></thead><tbody>"; 
		let posicion=0;
		users.forEach((user) => {
			posicion++;
			console.log(user);
			output += "<tr><th>"+posicion+"</th><th>"+user.name.toUpperCase()+"</th><th>"+user.maxScore+"</th></tr>";
		});
        output += "</tbody></table>";
		$("#ranking").html(output);
		
	});
}