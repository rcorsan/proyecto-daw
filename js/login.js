
let objeto = {
    "name": "testUser",
    "password": "testUser"
};

postLogin(objeto).then((data) => {
    console.info(data);
})





async function postLogin(params){
	let result;
	try{
		result = await $.ajax({
			type: "POST",
            contentType: "application/json",
			url: "https://proyectodaw-api.herokuapp.com/login",
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