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
	
	let output = "<div class='elemento'>";
	output += "<div style='display: flex; justify-content:flex-start; gap: 20px'><img src=\"../assets/000000/1x1/" + element.imagen + "\" alt=\"" + element.imagen + "\" width=\"96px\"/>";
	output += "<div><h1>" + capitalise(element.nombre) + "</h1>";
	output += "<h4>" + element.descripcion + "</h4></div></div>";
	if(element.explicacion) output += "<p>" + element.explicacion + "</p>";
	//if(element.coste) output += "<h5>Coste: " + element.coste + " puntos de espíritu</h5>";
	if(element.precio) output += "<h5>Precio: " + element.precio + " de oro</h5>";

	if(type=="Equipo" || type=="Enemigos"){
		output += "<h5>";
		let clase = element.clase;
		if(type=="Equipo") { 
			output += "Rareza: " + element.rareza +" <br/>";
			clase = capitalise(clase);
		}
		output += "Clase: " + clase + " <br/>Tipo: " + capitalise(element.tipo);
		output += "</h5>";
	}

	switch (type) {
		case "Habilidades":
			output +="<div class='grafico'><canvas class='graficoHab'></canvas></div>";
			output +="<h5>Nivel: " + element.requisitos.nivel + " <br/>Equipo: " + capitalise(element.requisitos.equipo) + " <br/>Coste: " + element.coste + " puntos de espíritu</h5>"
			break;

		case "Equipo":
			output +="<div class='grafico'><canvas class='graficoEq'></canvas></div>";
			break;

		case "Enemigos":
			output +="<div class='grafico'><canvas class='graficoEn'></canvas></div>";
			break;
	
		default:
			break;
	}

	output += "<div class='botonera'><button class='boton prev' id='prev'>ANTERIOR</button> <button class='boton back' id='back'>VOLVER</button> <button class='boton next' id='next'>SIGUIENTE</button></div>"

	output += "</div>";

	$("#" + type).html(output);

	if(type != "Consumibles") {
		if (type != "Enemigos") {
			generarGrafico(element);
		} else {
			generarGraficoEnemigo(element);
		}
	}

	$(".back").click(function (e) {
		e.preventDefault();
		generarBotones(type);
	});

	$(".prev").click(function (e) {
		e.preventDefault();
		let newId;
		let prev = false;
		elementos.forEach(elemento => {
			if(elemento.id < parseInt(id)){
				prev=true;
				newId=elemento.id;
			}
		});
		generarBotones(type);
		(prev == true)?mostrarElemento(newId):mostrarElemento(elementos[elementos.length-1].id);
	});

	$(".next").click(function (e) {
		e.preventDefault();
		let newId;
		let next = false;
		elementos.forEach(elemento => {
			if(elemento.id > parseInt(id) && !next){
				next=true;
				newId=elemento.id;
			}
		});
		generarBotones(type);
		(next == true)?mostrarElemento(newId):mostrarElemento(elementos[0].id);
	});
}

function generarGrafico(element){
	let datos = {};
	let label;
	let type;
	if (element.requisitos){
		datos = element.requisitos	
		label="REQUISITOS";
		type="Habilidades";
	}else{
		datos = element.estadisticas;
		label="ESTADISTICAS";
		type="Equipo";
	}
	datos = {
		"fuerza": datos.fuerza,
		"defensa": datos.defensa,
		"magia": datos.magia,
		"resistencia": datos.resistencia,
		"destreza": datos.destreza,
		"suerte": datos.suerte,
		"vitalidad": datos.vitalidad,
		"espiritu": datos.espiritu,
	};

	const data = {
		labels: [
			'VITALIDAD',
			'FUERZA',
			'DEFENSA',
			'DESTREZA',
			'ESPIRITU',
			'SUERTE',
			'RESISTENCIA',
			'MAGIA'
		],
		datasets: [{
			label: label,
			data: [datos.vitalidad, datos.fuerza, datos.defensa, datos.destreza, datos.espiritu, datos.suerte, datos.resistencia, datos.magia],
			fill: 'start',
			backgroundColor: 'rgba(112, 147, 211, 0.3)',
			borderColor: 'rgb(7, 2, 255)',
			pointBackgroundColor: 'rgb(7, 2, 255)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(7, 2, 255)'
		}]
	};

	const config = {
		type: 'radar',
		data: data,
		options: {
			elements: {
				line: {
					borderWidth: 3
				}
			},
			scales: {
				r: {
					ticks:{
						stepSize: 1
					},
					grid: {
						display: true
					},
					angleLines: {
						display: true
					},
					suggestedMin: -1
				}
			}
		},
	};

	if(type=="Habilidades"){
		const graficoHab = new Chart(
			$(".graficoHab"),
			config
		);
	}

	if(type=="Equipo"){
		const graficoEq = new Chart(
			$(".graficoEq"),
			config
		);
	}
}

function generarGraficoEnemigo(element){
	let max = element.estadisticasMax;
	let min = element.estadisticasMin;

	const data = {
		labels: [
			'VITALIDAD',
			'FUERZA',
			'DEFENSA',
			'DESTREZA',
			'ESPIRITU',
			'SUERTE',
			'RESISTENCIA',
			'MAGIA'
		],
		datasets: [{
			label: 'ESTADISTICAS MINIMAS',
			data: [min.vitalidad, min.fuerza, min.defensa, min.destreza, min.espiritu, min.suerte, min.resistencia, min.magia],
			fill: 'start',
			backgroundColor: 'rgba(112, 147, 211, 0.3)',
			borderColor: 'rgb(7, 2, 255)',
			pointBackgroundColor: 'rgb(7, 2, 255)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(7, 2, 255)'
		},{
			label: 'ESTADISTICAS MAXIMAS',
			data: [max.vitalidad, max.fuerza, max.defensa, max.destreza, max.espiritu, max.suerte, max.resistencia, max.magia],
			fill: '-1',
			backgroundColor: 'rgba(208, 106, 255, 0.3)',
			borderColor: 'rgb(188, 86, 235)',
			pointBackgroundColor: 'rgb(188, 86, 235)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(188, 86, 235)'
		}]
	};

	const config = {
		type: 'radar',
		data: data,
		options: {
			elements: {
				line: {
					borderWidth: 3
				}
			},
			scales: {
				r: {
					ticks:{
						stepSize: 1
					},
					grid: {
						display: true
					},
					angleLines: {
						display: true
					},
					suggestedMin: -1
				}
			}
		},
	};

	const graficoEn = new Chart(
		$(".graficoEn"),
		config
	);
}

function capitalise(texto){
	let aux = texto;
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}