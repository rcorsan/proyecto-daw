$( document ).ready(function() {

	$(".tablinks").click(function (e) { 
		e.preventDefault();
		abrirCatalogo(e);
	});

});

async function getAllConsumables(){
	let result;
	try{
		result = await $.ajax({
			type: "GET",
			url: "https://proyectodaw-api.herokuapp.com/consumables",
			success: function (data) {
				result = data;
			},
		});
		return result;
	} catch (error) {
		console.error(error);
	}	
}

async function getAllSkills(){
	let result;
	try{
		result = await $.ajax({
			type: "GET",
			url: "https://proyectodaw-api.herokuapp.com/skills",
			success: function (data) {
				result = data;
			},
		});
		return result;
	} catch (error) {
		console.error(error);
	}	
}

async function getAllEnemies(){
	let result;
	try{
		result = await $.ajax({
			type: "GET",
			url: "https://proyectodaw-api.herokuapp.com/enemies",
			success: function (data) {
				result = data;
			},
		});
		return result;
	} catch (error) {
		console.error(error);
	}	
}

async function getAllEquipments(){
	let result;
	try{
		result = await $.ajax({
			type: "GET",
			url: "https://proyectodaw-api.herokuapp.com/equipments",
			success: function (data) {
				result = data;
			},
		});
		return result;
	} catch (error) {
		console.error(error);
	}	
}

let consumables;
let skills;
let enemies;
let equipments;

getAllConsumables().then((data)=>{
	consumables=data;
});

getAllSkills().then((data)=>{
	skills=data;
});

getAllEnemies().then((data)=>{
	enemies=data;
});

getAllEquipments().then((data)=>{
	equipments=data;
});

function generarBotones(id){
	let elementos = [];
	switch(id){
		case "Enemigos":
			elementos = enemies;
			break;
		case "Consumibles":
			elementos = consumables;
			break;
		case "Equipo":
			elementos = equipments;
			break;
		default:
		case "Habilidades":
			elementos = skills;
			break;
	};
	let output = "<div class=\"grid-container\">";
	elementos.forEach(elemento => {
		let nombre = elemento.nombre;
		nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
		output += "<div class=\"caja\">" + nombre + "</div>";
	});
	output += "</div>";
	$("#" + id).html(output);
};

function abrirCatalogo(e) {
	$(".tabcontent").css({"display" : "none"});
	$(".tablinks").removeClass("active");
	const id = $(e.target).text();
	$("#" + id).css({"display" : "block"});
	$(e.target).addClass("active");
	generarBotones(id);
}