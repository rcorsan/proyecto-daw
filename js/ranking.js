$(document).ready(function () {
	generarRanking();
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
        let imagepath = "../assets/000000/1x1/";
        output +='<thead><tr><th>User</th><th>Puntuación máxima</th></tr></thead><tbody>'; 
		users.forEach((user) => {
			console.log(user);
			output += "<tr><th>"+user.name+"</th><th>"+user.maxScore+"</th></tr>";
		});
        output += "</tbody></table>";
		$("#ranking").html(output);
		
	});
}