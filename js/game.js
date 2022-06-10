let consumables;
getAllConsumables().then((data)=>{
	consumables=data;
});
let skills;
getAllSkills().then((data)=>{
	skills=data;
});
let enemies;
getAllEnemies().then((data)=>{
	enemies=data;
});
let equipments;
getAllEquipments().then((data)=>{
	equipments=data;
});

let session={};
let character={};
let room={};

$(document).ready(function () {
    $("#play-button").click(function (e) { 
        e.preventDefault();
        if(sessionCompr()){
            session = JSON.parse(localStorage.getItem('session'));
            (session.playing)?(elegirPartida()):(gameInit());
        }else{
            $(location).attr('href', "login");
        }
    });
});

function gameInit(){
    $("#index-buttons").css("display","none");
    $("#index-grid").css("display","grid");
    session = JSON.parse(localStorage.getItem('session'));
    if (session.playing){
        character = session.character;
        room = session.room;
    }else{
        session.score = 0;
        character = new Character();
        session.character = character;
        room = new TreasureRoom(1);
        session.room = room;
        session.playing = true;
    }
    localStorage.setItem('session', JSON.stringify(session));
    generarViews();
    

}

function elegirPartida(){
    let output = "<h1 class='centered-title'>Ya existe una partida empezada.<br/>¿Deseas continuar la partida anterior?</h1>";
    output += "<button id='continue-button' class='caja'>CONTINUAR PARTIDA</button>";
    output += "<button id='new-game-button' class='caja'>NUEVA PARTIDA</button>";
    $("#index-buttons").html(output);

    $("#continue-button").click(function (e) { 
        e.preventDefault();
        gameInit();
    });

    $("#new-game-button").click(function (e) { 
        e.preventDefault();
        session.playing = false;
        localStorage.setItem('session', JSON.stringify(session));
        gameInit();
    });
}

class Character {
    constructor(){
        this.fuerza = 2 + randomNum(0, 5);
        this.defensa = 2 + randomNum(0, 4);
        this.magia = 2 + randomNum(0, 5);
        this.resistencia = 2+ randomNum(0, 4);
        this.destreza = 2+ randomNum(0, 3);
        this.suerte = 2+ randomNum(0, 3);
        this.vitalidad = 2 + randomNum(0, 2);
        this.espiritu = 2 + randomNum(0, 2);
        this.vida = this.vitalidad * 5;
        this.energia = this.espiritu * 5;
        this.oro = 0;
        this.nivel = 1;
        this.exp = 0;
        this.equipo = {
            "arma": {
                "nombre":"palo de madera",
                "descripcion":"Los niños juegan con esto.",
                "estadisticas":{"fuerza":2,"magia":0,"defensa":0,"resistencia":0,"destreza":1,"suerte":0,"vitalidad":0,"espiritu":0},
                "precio":5,
                "clase":"arma",
                "tipo":"espada",
                "rareza":0,
                "imagen":"delapouite/wood-stick.svg"
            },
            "cabeza": {
                "nombre":"sombrero de aventurero",
                "descripcion":"De los bosques de Notts a tu sesera.",
                "estadisticas":{"fuerza":0,"magia":0,"defensa":1,"resistencia":0,"destreza":1,"suerte":0,"vitalidad":0,"espiritu":0},
                "precio":5,
                "clase":"cabeza",
                "tipo":"ligero",
                "rareza":0,
                "imagen":"delapouite/robin-hood-hat.svg"
            },
            "torso": {
                "nombre":"camisa de campesino",
                "descripcion":"Esta camisa necesita un buen lavado.",
                "estadisticas":{"fuerza":0,"magia":0,"defensa":2,"resistencia":1,"destreza":0,"suerte":0,"vitalidad":0,"espiritu":0},
                "precio":5,
                "clase":"torso",
                "tipo":"ligero",
                "rareza":0,
                "imagen":"lucasms/shirt.svg"
            },
            "piernas": {
                "nombre":"botas viejas",
                "descripcion":"No hay agujero que un buen parche no pueda arreglar.",
                "estadisticas":{"fuerza":0,"magia":0,"defensa":0,"resistencia":0,"destreza":2,"suerte":0,"vitalidad":0,"espiritu":0},
                "precio":5,
                "clase":"piernas",
                "tipo":"ligero",
                "rareza":0,
                "imagen":"lorc/leather-boot.svg"
            }
        }
    }
}

class Enemy {
    constructor(clase){
        let modelo = generarEnemigo(clase);
        this.clase=modelo.clase;
        this.nombre=modelo.nombre;
        this.imagen=modelo.imagen;
        this.tipo=modelo.tipo;
        this.fuerza=randomNum(modelo.estadisticasMin.fuerza, modelo.estadisticasMax.fuerza);
        this.defensa=randomNum(modelo.estadisticasMin.defensa, modelo.estadisticasMax.defensa);
        this.destreza=randomNum(modelo.estadisticasMin.destreza, modelo.estadisticasMax.destreza);
        this.magia=randomNum(modelo.estadisticasMin.magia, modelo.estadisticasMax.magia);
        this.resistencia=randomNum(modelo.estadisticasMin.resistencia, modelo.estadisticasMax.resistencia);
        this.suerte=randomNum(modelo.estadisticasMin.suerte, modelo.estadisticasMax.suerte);
        this.vitalidad=randomNum(modelo.estadisticasMin.vitalidad, modelo.estadisticasMax.vitalidad);
        this.espiritu=randomNum(modelo.estadisticasMin.espiritu, modelo.estadisticasMax.espiritu);
        this.vida=this.vitalidad*5;
        this.energia=this.espiritu*5;
    }
}

class Equipment {
    constructor(numSala){
        this.rareza = generarRarezaEquipo(numSala);
        let modelo = generarEquipo(this.rareza);
        this.nombre = modelo.nombre;
        this.descripcion = modelo.descripcion;
        this.estadisticas = modelo.estadisticas;
        this.precio = modelo.precio;
        this.clase = modelo.clase;
        this.tipo = modelo.tipo;
        this.imagen = modelo.imagen;
    }
}

class Consumable {
    constructor(numSala){
        let modelo = generarConsumible(numSala);
        this.nombre = modelo.nombre;
        this.descripcion = modelo.descripcion;
        this.explicacion = modelo.explicacion;
        this.precio = modelo.precio;
        this.imagen = modelo.imagen;
    }
}

class Room {
    constructor(type, number){
        this.type=type;
        this.number=number;
        this.dialogue="";
    }
}

class BattleRoom extends Room {
    constructor(number){
        super((number%10==0)?("jefe"):("batalla"), number);
        this.enemy = new Enemy(generarClaseEnemigo(number));
        this.turn = 1;
        this.dialogue = "Un enemigo te corta el paso...";
    }
}

class RestRoom extends Room {
    constructor(number){
        super("descanso", number);
        this.dialogue = "Has llegado a un sitio pacífico. Parece un buen lugar para descansar...";
    }
}

class ShopRoom extends Room {
    constructor(number){
        super("tienda", number);
        this.dialogue = "Un comerciante perdido te ofrece sus productos a un precio \"justo\"...";
        this.products = [
            {stock: true, product: new Equipment(number)},
            {stock: true, product: new Consumable(number)},
            {stock: true, product: new Consumable(number)}
        ];
    }
}

class TreasureRoom extends Room {
    constructor(number){
        super("tesoro", number);
        this.dialogue = "Hay un cofre abierto en el centro de la sala. Parece que se te han adelantado, pero al acercarte ves que en el fondo todavía queda algo...";
        this.treasure = {stock:true, item: generarTesoro(number)};
        this.treasureType = (this.treasure.item instanceof Consumable)?("consumable"):("equipment");
    }
}

function generarViews(){
    $("#index-grid").html(playerView()+dialogueView()+actionsView()+roomView());
    graficoPlayer();
    if(room.enemy)graficoEnemy();
}

function playerView(){
    let view = "<div class='player'>";
    view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + session.image + "' alt='profile-img' />";
    view += "<h1>" + session.name + "</h1></div>";
    view += "<div style='display: flex; align-items: center; justify-content: space-between;'><h3>Nivel: " + character.nivel + "</h3><h3>Experiencia: " + character.exp + "/" + (character.nivel + 1) * 50 + "</h3></div>";
    view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'>";
    view += "<h4>Estadísticas: </h4>";
    view += "<div><h5>Fuerza: " + (character.fuerza + character.equipo.arma.estadisticas.fuerza + character.equipo.cabeza.estadisticas.fuerza + character.equipo.torso.estadisticas.fuerza + character.equipo.piernas.estadisticas.fuerza);
    view += "<br/>Defensa: " + (character.defensa + character.equipo.arma.estadisticas.defensa + character.equipo.cabeza.estadisticas.defensa + character.equipo.torso.estadisticas.defensa + character.equipo.piernas.estadisticas.defensa);
    view += "<br/>Destreza: " + (character.destreza + character.equipo.arma.estadisticas.destreza + character.equipo.cabeza.estadisticas.destreza + character.equipo.torso.estadisticas.destreza + character.equipo.piernas.estadisticas.destreza);
    view += "<br/>Vitalidad: " + character.vida + "/" + (character.vitalidad * 5 + character.equipo.arma.estadisticas.vitalidad *5 + character.equipo.cabeza.estadisticas.vitalidad *5 + character.equipo.torso.estadisticas.vitalidad *5 + character.equipo.piernas.estadisticas.vitalidad *5) + "</h5></div>";
    view += "<div><h5>Magia: " + (character.magia + character.equipo.arma.estadisticas.magia + character.equipo.cabeza.estadisticas.magia + character.equipo.torso.estadisticas.magia + character.equipo.piernas.estadisticas.magia);
    view += "<br/>Resistencia: " + (character.resistencia + character.equipo.arma.estadisticas.resistencia + character.equipo.cabeza.estadisticas.resistencia + character.equipo.torso.estadisticas.resistencia + character.equipo.piernas.estadisticas.resistencia);
    view += "<br/>Suerte: " + (character.suerte + character.equipo.arma.estadisticas.suerte + character.equipo.cabeza.estadisticas.suerte + character.equipo.torso.estadisticas.suerte + character.equipo.piernas.estadisticas.suerte);
    view += "<br/>Espíritu: " + character.energia + "/" + (character.espiritu * 5 + character.equipo.arma.estadisticas.espiritu * 5 + character.equipo.cabeza.estadisticas.espiritu * 5 + character.equipo.torso.estadisticas.espiritu * 5 + character.equipo.piernas.estadisticas.espiritu * 5) + "</h5></div>";
    view += "</div>";
    view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'>";
    view += "<h4>Equipo: </h4>";
    view += "<h5>Arma: " + capitalise(character.equipo.arma.nombre) + " (" + capitalise(character.equipo.arma.tipo) + ")";
    view += "<br/>Cabeza: " + capitalise(character.equipo.cabeza.nombre) + " (" + capitalise(character.equipo.cabeza.tipo) + ")";
    view += "<br/>Torso: " + capitalise(character.equipo.torso.nombre) + " (" + capitalise(character.equipo.torso.tipo) + ")";
    view += "<br/>Piernas: " + capitalise(character.equipo.piernas.nombre) + " (" + capitalise(character.equipo.piernas.tipo) + ")";
    view += "</div>";
    view += "<canvas id='grafico-player' class='grafico-player'></canvas>";
    view += "</div>";
    return view;
}

function dialogueView(){
    let view = "<div class='dialogue'>";
    view += "<strong>" + room.dialogue + "</strong>";
    view += "</div>";
    return view;
}

function actionsView(){
    let view = "<div class='actions'>";
    let actions = generarActions();
    
    if(actions <= 8){
        view += "<div style='display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; align-content: center; gap: 25px 50px;'>";
        actions.forEach(action => {
            view += "<div class='caja " + action.action + "'>" + action.label + "</div>";
        });
        view += "</div>";
    }else {
        for (let pag = 0; pag <= (Math.trunc(actions.length/8)); pag ++){
            if(pag==0){
                view += "<div id='pag-" + pag + "' style='display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; align-content: center; gap: 25px 50px;'>";
            }else{
                view += "<div id='pag-" + pag + "' style='display: none; flex-wrap: wrap; justify-content: space-around; align-items: center; align-content: center; gap: 25px 50px;'>";
            }
            for (let i = 0; i < actions.length; i++){
                if(Math.trunc(i/8)==pag){
                    view += "<div class='caja " + actions[i].action + "'>" + actions[i].label + "</div>";
                }
            }
            view += "</div>";
        }
    }
    
    view += "</div>";
    return view;
}

function roomView(){
    let view = "<div class='room'>";
    switch (room.type) {
        case "batalla":
        case "jefe":
            let claseLit = "Desconocida";
            switch (room.enemy.clase) {
                case 0:
                    claseLit = "Insignificante";
                    break;
                case 1:
                    claseLit = "Amenaza Regional";
                    break;
                case 2:
                    claseLit = "Amenaza Nacional";
                    break;
                case 3:
                    claseLit = "Amenaza Mundial";
                    break;
                default:
                    claseLit = "Desconocida";
                    break;
            }
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + room.enemy.imagen + "' alt='enemy-img' />";
            view += "<h1>" + capitalise(room.enemy.nombre) + "</h1></div>";
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between; flex-direction: column;'><h3>Clase: " + claseLit + "<br/>Tipo: " + capitalise(room.enemy.tipo) + "</h3></div>";
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'>";
            view += "<h4>Estadísticas: </h4>";
            view += "<div><h5>Fuerza: " + room.enemy.fuerza;
            view += "<br/>Defensa: " + room.enemy.defensa;
            view += "<br/>Destreza: " + room.enemy.destreza;
            view += "<br/>Vitalidad: " + room.enemy.vida + "/" + (room.enemy.vitalidad * 5) + "</h5></div>";
            view += "<div><h5>Magia: " + room.enemy.magia;
            view += "<br/>Resistencia: " + room.enemy.resistencia;
            view += "<br/>Suerte: " + room.enemy.suerte;
            view += "<br/>Espíritu: " + room.enemy.energia + "/" + (room.enemy.espiritu * 5) + "</h5></div>";
            view += "</div>";
            view += "<canvas id='grafico-enemy' class='grafico-enemy'></canvas>";
            view += "<strong>Turno: " + room.turn +"</strong>";
            break;

        case "tienda":
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/delapouite/backpack.svg' alt='merchant-img' />";
            view += "<h1>Comerciante</h1></div>";
            view += "<div style='display: flex; align-items: center; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + room.products[0].product.imagen + "' alt='merchant-item-img' />";
            view += "<div style='display: flex; flex-direction: column; align-items: flex-end;'><h3>" + capitalise(room.products[0].product.nombre) + "</h3>";
            let rarezaLit = "Común";
            switch (room.products[0].product.rareza) {
                case 1:
                    rarezaLit = "Raro";
                    break;
                
                case 2:
                    rarezaLit = "Épico";
                    break;

                case 3:
                    rarezaLit = "Legendario";
                    break;
                
                default:
                case 0:
                    rarezaLit = "Común";
                    break;
            }
            view += "<h4>Rareza: " + rarezaLit;
            view += "<br/>Precio: " + room.products[0].product.precio + "</h4></div></div>";
            for(let i = 1; i<3; i++){
                view += "<div style='display: flex; align-items: center; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + room.products[i].product.imagen + "' alt='merchant-item-img' />";
                view += "<div style='display: flex; flex-direction: column; align-items: flex-end;'><h3>" + capitalise(room.products[i].product.nombre) + "</h3>";
                view += "<h4 style='max-width: 90%;'>" + room.products[i].product.explicacion;
                view += "<br/>Precio: " + room.products[i].product.precio + "</h4></div></div>"
            }
            break;

        case "tesoro":
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/skoll/open-chest.svg' alt='treasure-img' />";
            view += "<h1>Cofre casi vacio</h1></div>";
            view += "<h2>Al fondo del recipiente te encuentras:</h2>";
            view += "<div style='display: flex; align-items: center; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + room.treasure.item.imagen + "' alt='treasure-item-img' />";
            view += "<div style='display: flex; flex-direction: column; align-items: flex-end;'><h3>" + capitalise(room.treasure.item.nombre) + "</h3>";
            if (room.treasureType == "consumable"){
                view += "<h4 style='max-width: 90%;'>" + room.treasure.item.explicacion + "</h4></div></div>";
            }else if (room.treasureType == "equipment"){
                let rarezaLit = "Común";
                switch (room.treasure.item.rareza) {
                    case 1:
                        rarezaLit = "Raro";
                        break;
                    
                    case 2:
                        rarezaLit = "Épico";
                        break;

                    case 3:
                        rarezaLit = "Legendario";
                        break;
                    
                    default:
                    case 0:
                        rarezaLit = "Común";
                        break;
                }
                view += "<h4>Rareza: " + rarezaLit + "</h4></div></div>";
                view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'>"
                view += "<h4>Estadísticas: </h4>";
                view += "<div><h5>Fuerza: " + room.treasure.item.estadisticas.fuerza;
                view += "<br/>Defensa: " + room.treasure.item.estadisticas.defensa;
                view += "<br/>Destreza: " + room.treasure.item.estadisticas.destreza;
                view += "<br/>Vitalidad: " + room.treasure.item.estadisticas.vitalidad + "</h5></div>";
                view += "<div><h5>Magia: " + room.treasure.item.estadisticas.magia;
                view += "<br/>Resistencia: " + room.treasure.item.estadisticas.resistencia;
                view += "<br/>Suerte: " + room.treasure.item.estadisticas.suerte ;
                view += "<br/>Espíritu: " + room.treasure.item.estadisticas.espiritu + "</h5></div>";
                view += "</div>";
            }
                        
            break;

        default:
        case "descanso":
            view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/delapouite/camping-tent.svg' alt='tent-img' />";
            view += "<h1>Sala vacía</h1></div>";
            view += "<h2>En esta sala no hay peligro, puedes descansar aquí para restaurar tu vitalidad y espíritu por completo.</h2>";
            view += "<h2>También puedes continuar sin descansar si lo deseas.</h2>";
            view += "<h3>Se recomienda descansar de vez en cuando.</h3>";
            break;
    }
    view += "<div style='display: flex; align-items: flex-end; justify-content: space-between;'><h4>Sala: " + capitalise(room.type) + "</h4><h4>Piso: " + room.number + "</h4><h4>Puntuación: " + session.score + "</h4></div>";
    view += "</div>";
    return view;
}

function graficoPlayer(){

    let fuerzaEquipo = character.equipo.arma.estadisticas.fuerza + character.equipo.cabeza.estadisticas.fuerza + character.equipo.torso.estadisticas.fuerza + character.equipo.piernas.estadisticas.fuerza;
    let defensaEquipo = character.equipo.arma.estadisticas.defensa + character.equipo.cabeza.estadisticas.defensa + character.equipo.torso.estadisticas.defensa + character.equipo.piernas.estadisticas.defensa;
    let destrezaEquipo = character.equipo.arma.estadisticas.destreza + character.equipo.cabeza.estadisticas.destreza + character.equipo.torso.estadisticas.destreza + character.equipo.piernas.estadisticas.destreza;
    let magiaEquipo = character.equipo.arma.estadisticas.magia + character.equipo.cabeza.estadisticas.magia + character.equipo.torso.estadisticas.magia + character.equipo.piernas.estadisticas.magia;
    let resistenciaEquipo = character.equipo.arma.estadisticas.resistencia + character.equipo.cabeza.estadisticas.resistencia + character.equipo.torso.estadisticas.resistencia + character.equipo.piernas.estadisticas.resistencia;
    let suerteEquipo = character.equipo.arma.estadisticas.suerte + character.equipo.cabeza.estadisticas.suerte + character.equipo.torso.estadisticas.suerte + character.equipo.piernas.estadisticas.suerte;
    let vitalidadEquipo = character.equipo.arma.estadisticas.vitalidad + character.equipo.cabeza.estadisticas.vitalidad + character.equipo.torso.estadisticas.vitalidad + character.equipo.piernas.estadisticas.vitalidad;
    let espirituEquipo = character.equipo.arma.estadisticas.espiritu + character.equipo.cabeza.estadisticas.espiritu + character.equipo.torso.estadisticas.espiritu + character.equipo.piernas.estadisticas.espiritu;

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
			label: 'ESTADISTICAS BASE',
			data: [character.vitalidad, character.fuerza, character.defensa, character.destreza, character.espiritu, character.suerte, character.resistencia, character.magia],
			fill: 'start',
			backgroundColor: 'rgba(112, 147, 211, 0.3)',
			borderColor: 'rgb(7, 2, 255)',
			pointBackgroundColor: 'rgb(7, 2, 255)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(7, 2, 255)'
		},{
			label: 'ESTADISTICAS EQUIPO',
			data: [vitalidadEquipo, fuerzaEquipo, defensaEquipo, destrezaEquipo, espirituEquipo, suerteEquipo, resistenciaEquipo, magiaEquipo],
			fill: 'start',
			backgroundColor: 'rgba(208, 106, 255, 0.3)',
			borderColor: 'rgb(188, 86, 235)',
			pointBackgroundColor: 'rgb(188, 86, 235)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(188, 86, 235)'
		},{
            label: 'ESTADISTICAS TOTALES',
			data: [character.vitalidad + vitalidadEquipo, character.fuerza + fuerzaEquipo, character.defensa + defensaEquipo, character.destreza + destrezaEquipo, character.espiritu + espirituEquipo, character.suerte + suerteEquipo, character.resistencia + resistenciaEquipo, character.magia + magiaEquipo],
			fill: '-1',
			backgroundColor: 'rgba(260, 148, 148, 0.3)',
			borderColor: 'rgb(240, 128, 128)',
			pointBackgroundColor: 'rgb(240, 128, 128)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(240, 128, 128)'
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
						display: false,
                        stepSize: 5
					},
					grid: {
						display: true
					},
					angleLines: {
						display: true
					},
					suggestedMin: -1
				}
			},
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
		},
	};

	const graficoPlayer = new Chart(
		$(".grafico-player"),
		config
	);
}

function graficoEnemy(){

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
			label: 'ESTADISTICAS ENEMIGAS',
			data: [room.enemy.vitalidad, room.enemy.fuerza, room.enemy.defensa, room.enemy.destreza, room.enemy.espiritu, room.enemy.suerte, room.enemy.resistencia, room.enemy.magia],
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
						display: false,
                        stepSize: 5
					},
					grid: {
						display: true
					},
					angleLines: {
						display: true
					},
					suggestedMin: -1
				}
			},
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
		},
	};

    const graficoEnemy = new Chart(
		$(".grafico-enemy"),
		config
	);
}

function generarActions() {

    let actions = [];

    switch (room.type) {
        case "batalla":
        case "jefe":
            actions.push({label: "Atacar", action: "atacar"});
            actions.push({label: "Habilidades", action: "ver-habilidades"});
            actions.push({label: "Objetos", action: "ver-objetos"});
            actions.push({label: "Huir", action: "huir"});
            break;

        case "tienda":
            actions.push({label: capitalise(room.products[0].product.nombre), action: "producto-0"});
            actions.push({label: capitalise(room.products[1].product.nombre), action: "producto-1"});
            actions.push({label: capitalise(room.products[2].product.nombre), action: "producto-2"});
            actions.push({label: "Continuar",action: "continuar"});
            break;

        case "tesoro":
            actions.push({label: capitalise(room.treasure.item.nombre), action: "tesoro"});
            actions.push({label: "Continuar", action: "continuar"});
            break;

        default:
        case "descanso":
            actions.push({label: "Descansar", action: "descansar"});
            actions.push({label: "Continuar", action: "continuar"});
            break;
    }

    return actions;
}

function generarEnemigo(clase){
    let enemigos = [];
    enemies.forEach(enemy => {
        if (enemy.clase == clase){
            enemigos.push(enemy);
        }
    });
    let indice = randomNum(0,enemigos.length - 1);
    return enemigos[indice];
}

function generarClaseEnemigo(numSala) {
    let result = 0;
    
    if (numSala == 10){
        result = 3;
    }else if((numSala % 10) < 4){
        result = 0;
    }else if((numSala % 5) < 7){
        result = 1;
    }else result = 2;

    return result;
}

function generarTesoro(numSala) {
    let result = new Equipment(numSala);
    
    if (10<numSala<30){
        let aux = randomNum(1,10);
        if (aux > 7){
            result = new Consumable(numSala);
        }
    }else if (numSala>30){
        let aux = randomNum(1,10);
        if (aux > 5){
            result = new Consumable(numSala);
        }
    }
    
    return result;
}

function generarConsumible(numSala) {
    let precioMax = 50;

    if (numSala > 30){
        precioMax = 300;
    }else if(numSala < 10){
        precioMax = 50;
    }else if(numSala < 20){
        precioMax = 100;
    }else precioMax = 150;

    let consumibles = [];
    consumables.forEach(consumable => {
        if (consumable.precio<=precioMax){
            consumibles.push(consumable);
        }
    });
    let indice = randomNum(0,consumibles.length - 1);
    return consumibles[indice];
}

function generarEquipo(rareza) {
    let equipos = [];
    equipments.forEach(equipment => {
        if (equipment.rareza == rareza){
            equipos.push(equipment);
        }
    });
    let indice = randomNum(0,equipos.length - 1);
    return equipos[indice];
}

function generarRarezaEquipo(numSala) {
    let result = 0;

    if (numSala > 30){
        let aux = randomNum(1,10);
        if(aux>5) result = 2;
        else result = 3;
    }else if(numSala < 10){
        let aux = randomNum(1,10);
        if(aux>5) result = 0;
        else result = 1;
    }else if(numSala < 20){
        let aux = randomNum(1,10);
        if(aux>5) result = 1;
        else result = 2;
    }else result = 2;

    return result;
}

function capitalise(texto){
	let aux = texto;
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//FUNCIONES QUE HACEN LLAMADA GET A LA API PARA OBTENER LOS DATOS ALMACENADOS EN LA BBDD
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