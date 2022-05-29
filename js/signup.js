
let objeto = {
    "name": "testUser3",
    "password": "testUser3"
};

postSignup(objeto).then((data) => {
    console.info(data);
})





async function postSignup(params){
	let result;
	try{
		result = await $.ajax({
			type: "POST",
            contentType: "application/json",
			url: "https://proyectodaw-api.herokuapp.com/signup",
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