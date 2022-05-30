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
let elementos = [];
function generarBotones(id){
	
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
		output += "<div class=\"caja " + id + "\" id=\""+elemento.id+"\">" + nombre + "</div>";
	});
	output += "</div>";
	$("#" + id).html(output);

	$(".caja").click(function (e) {
		e.preventDefault();
		let id = e.target.id;
		mostrarElemento(id);
	});
};

function abrirCatalogo(e) {
	$(".tabcontent").css({"display" : "none"});
	$(".tablinks").removeClass("active");
	const id = $(e.target).text();
	$("#" + id).css({"display" : "block"});
	$(e.target).addClass("active");
	generarBotones(id);
}

function mostrarElemento(id){
	const type = $("#"+id)[0].classList[1];

	let element;
	elementos.forEach(elemento => {
		if(elemento.id == id){
			element=elemento;
		}
	});

	let name = element.nombre;
	name = name.charAt(0).toUpperCase() + name.slice(1);
	
	let output = "<img src=\"../assets/000000/1x1/" + element.imagen + "\" alt=\"" + element.imagen + "\" width=\"96px\"/>";
	output += "<h1>" + name + "</h1>";
	output += "<h4>" + element.descripcion + "</h4>";
	if(element.explicacion) output += "<p>" + element.explicacion + "</p>";
	if(element.coste) output += "<p>Coste: " + element.coste + " puntos de espíritu</p>";
	if(element.precio) output += "<p>Precio: " + element.precio + " de oro</p>";

	output += "<button class='boton' id='prev'>ANTERIOR</button> <button class='boton' id='back'>VOLVER</button> <button class='boton' id='next'>SIGUIENTE</button>"

	$("#" + type).html(output);

	$("#back").click(function (e) {
		e.preventDefault();
		generarBotones(type);
	});
	
	$("#prev").click(function (e) {
		e.preventDefault();
		let newId = parseInt(id)-1;
		let prev = false;
		elementos.forEach(elemento => {
			if(elemento.id == newId){
				prev=true;
			}
		});
		generarBotones(type);
		(prev == true)?mostrarElemento(newId):mostrarElemento(elementos[elementos.length-1].id);
	});

	$("#next").click(function (e) {
		e.preventDefault();
		let newId = parseInt(id)+1;
		let next = false;
		elementos.forEach(elemento => {
			if(elemento.id == newId){
				next=true;
			}
		});
		generarBotones(type);
		(next == true)?mostrarElemento(newId):mostrarElemento(elementos[0].id);
	});
}