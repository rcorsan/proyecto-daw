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
        room = new BattleRoom(1);
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
        this.inventario = [];
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
            {stock: true, product: new Equipment(number), type: "equipment"},
            {stock: true, product: new Consumable(number), type: "consumable"},
            {stock: true, product: new Consumable(number), type: "consumable"}
        ];
    }
}

class TreasureRoom extends Room {
    constructor(number){
        super("tesoro", number);
        this.dialogue = "Hay un cofre abierto en el centro de la sala. Parece que se te han adelantado, pero al acercarte ves que en el fondo todavía queda algo...";
        this.treasure = {stock:true, item: generarTesoro(number)};
        this.treasure.type = (this.treasure.item instanceof Consumable)?("consumable"):("equipment");
    }
}

function generarViews(){
    $("#index-grid").html(playerView()+dialogueView()+actionsView()+roomView());
    graficoPlayer();
    if(room.enemy)graficoEnemy();
    generarEventos();
}

function playerView(){
    let view = "<div class='player'>";
    view += "<div style='display: flex; align-items: flex-start; justify-content: space-between;'><img class='info-img' src='./assets/000000/1x1/" + session.image + "' alt='profile-img' />";
    view += "<h1>" + session.name + "</h1></div>";
    view += "<div style='display: flex; align-items: center; justify-content: space-between;'><h3>Nivel: " + character.nivel + "</h3><h4>Experiencia: " + character.exp + "/" + (character.nivel + 1) * 50 + "</h4><h4>Oro: " + character.oro + "</h4></div>";
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
            if (room.treasure.type == "consumable"){
                view += "<h4 style='max-width: 90%;'>" + room.treasure.item.explicacion + "</h4></div></div>";
            }else if (room.treasure.type == "equipment"){
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
                let actual = character.equipo.arma;
                switch (room.treasure.item.clase) {
                    case "cabeza":
                        actual = character.equipo.cabeza;
                        break;

                    case "torso":
                        actual = character.equipo.torso;
                        break;

                    case "piernas":
                        actual = character.equipo.piernas;
                        break;
                
                    case "arma":
                    default:
                        actual = character.equipo.arma;
                        break;
                }
                view += "<div><h5>Fuerza: " + room.treasure.item.estadisticas.fuerza + " (" + (room.treasure.item.estadisticas.fuerza - actual.estadisticas.fuerza) + ")";
                view += "<br/>Defensa: " + room.treasure.item.estadisticas.defensa + " (" + (room.treasure.item.estadisticas.defensa - actual.estadisticas.defensa) + ")";
                view += "<br/>Destreza: " + room.treasure.item.estadisticas.destreza + " (" + (room.treasure.item.estadisticas.destreza - actual.estadisticas.destreza) + ")";
                view += "<br/>Vitalidad: " + room.treasure.item.estadisticas.vitalidad + " (" + (room.treasure.item.estadisticas.vitalidad - actual.estadisticas.vitalidad) + ")</h5></div>";
                view += "<div><h5>Magia: " + room.treasure.item.estadisticas.magia + " (" + (room.treasure.item.estadisticas.magia - actual.estadisticas.magia) + ")";
                view += "<br/>Resistencia: " + room.treasure.item.estadisticas.resistencia + " (" + (room.treasure.item.estadisticas.resistencia - actual.estadisticas.resistencia) + ")";
                view += "<br/>Suerte: " + room.treasure.item.estadisticas.suerte + " (" + (room.treasure.item.estadisticas.suerte - actual.estadisticas.suerte) + ")";
                view += "<br/>Espíritu: " + room.treasure.item.estadisticas.espiritu + " (" + (room.treasure.item.estadisticas.espiritu - actual.estadisticas.espiritu) + ")</h5></div>";
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
    
    if ((numSala % 10) == 0){
        result = 3;
    }else if(numSala < 10){
        result = 0;
    }else if(numSala < 30){
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
    let precioMax = 25;

    if (numSala > 30){
        precioMax = 300;
    }else if(numSala < 10){
        precioMax = 25;
    }else if(numSala < 20){
        precioMax = 50;
    }else precioMax = 100;

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

function generarEventos() {
    $(".nueva-partida").click(function (e) {
        e.preventDefault();
        gameInit();
    });

    $(".salir").click(function (e) { 
        e.preventDefault();
        session.playing = false;
        localStorage.setItem('session', JSON.stringify(session));
        $(location).attr('href', document.location.href);
    });

    $(".continuar").click(function (e) { 
        e.preventDefault();
        siguienteSala();
    });
    
    $(".descansar").click(function (e) {
        e.preventDefault();
        room.dialogue = "";
        restaurar();
        session.character = character;
        session.room = room;
        generarViews();
        victoriaActions();
    });
    
    $(".atacar").click(function (e) { 
        e.preventDefault();
        atacar();
    });

    $(".ver-habilidades").click(function (e) { 
        e.preventDefault();
        console.log("hab");
    });

    $(".ver-objetos").click(function (e) { 
        e.preventDefault();
        console.log("obj");
    });

    $(".huir").click(function (e) { 
        e.preventDefault();
        let aux = randomNum(1,5);
        let prob = aux + (character.destreza * 0.025 - (room.enemy.destreza * 0.0125)) + (character.suerte * 0.0125);
        if (prob > 4) {
            siguienteSala();
        }else{
            room.dialogue = "No has podido escapar...<br/>";
            turnoEnemigo();
        }
    });

    $(".tesoro").click(function (e) { 
        e.preventDefault();
        room.dialogue = "Has obtenido " + room.treasure.item.nombre + ".";
        tomarObjeto(false, room.treasure);
        session.room = room;
        generarViews();
        victoriaActions();
    });
}

function atacar() {
    let ataque = character.fuerza;
    let debilitacion = room.enemy.defensa / 2;

    if(character.equipo.arma.tipo=="báculo" || character.equipo.arma.tipo=="varita" || character.equipo.arma.tipo=="orbe" || character.equipo.arma.tipo=="tomo"){
        ataque = character.magia;
        debilitacion = room.enemy.resistencia / 2;
    }

    let daño = parseInt(ataque - debilitacion);

    daño = parseInt(daño);
    if(daño<1)daño = 1;

    room.enemy.vida += -daño;
    room.dialogue = "Has atacado y el enemigo ha perdido " + daño + " puntos de vida.<br/>";
    if(room.enemy.vida<0) room.enemy.vida = 0;

    session.room = room;
    session.character = character;
    turnoEnemigo();
}

function turnoEnemigo() {
    let victoria = false;
    let derrota = false;
    if(room.enemy.vida <= 0){
        room.dialogue += "Has derrotado al enemigo.<br/>";
        victoria = true;
        session.score += 100 + 50 * room.enemy.clase;
        character.exp += 50 + 25 * room.enemy.clase;
        character.oro += 10 * (parseInt((room.enemy.clase) * 1.5) + 1);
        room.dialogue += "Has recibido " + (50 + 25 * room.enemy.clase) + " puntos de experiencia y " + (10 * (parseInt((room.enemy.clase) * 1.5) + 1)) + " de oro.<br/>";
        if (character.exp >= (50 + character.nivel * 50)){
            subirNivel();
        }
    }else{
        let ataque = room.enemy.fuerza;
        let debilitacion = character.defensa / 2;
        if (room.enemy.magia > room.enemy.fuerza) {
            ataque = room.enemy.magia;
            debilitacion = character.resistencia / 2;
        }
        let daño = ataque - debilitacion;
        daño = parseInt(daño);
        if(daño<1)daño = 1;
        character.vida += -daño;
        room.dialogue += "El enemigo te ha atacado y has perdido " + daño + " puntos de vida.";
        if(character.vida<1) {
            character.vida = 0;
            derrota = true;
            room.dialogue += "<br/>Tu personaje ha caido en combate.<br/>¿Deseas empezar de nuevo?";
            if(session.score > session.maxScore){
                session.maxScore = session.score;
            }
            session.playing = false;
            localStorage.setItem('session', JSON.stringify(session));
        }else{
            room.turn += 1;
        }
    }
    
    session.character = character;
    session.room = room;
    localStorage.setItem('session', JSON.stringify(session));
    generarViews();

    if (derrota){
        derrotaActions();
    }
    if (victoria){
        victoriaActions();
    }
}

function derrotaActions() {
    let view = "<div style='display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; align-content: center; gap: 25px 50px;'>";
    view += "<div class='caja nueva-partida'>Empezar de nuevo</div>";
    view += "<div class='caja salir'>Volver al inicio</div>";
    view += "</div>";
    $(".actions").html(view);
    generarEventos();
}

function victoriaActions() {
    let view = "<div style='display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; align-content: center; gap: 25px 50px;'>";
    view += "<div class='caja continuar'>Continuar</div>";
    view += "</div>";
    $(".actions").html(view);
    generarEventos();
}

function siguienteSala() {
    if((room.number + 1) % 10 != 3 && (room.number + 1) % 10 != 6 && (room.number + 1) % 10 != 9){
        room = new BattleRoom(room.number + 1);
    }else{
        let aux = randomNum(1,3)
        switch (aux) {
            case 1:
                room = new RestRoom(room.number + 1);
                break;
        
            case 2:
                room = new ShopRoom(room.number + 1);
                break;

            case 3:
            default:
                room = new TreasureRoom(room.number + 1);
                break;
        }
    }    
    session.room = room;
    localStorage.setItem('session', JSON.stringify(session));
    generarViews();
}

function subirNivel() {
    character.exp = character.exp - (50 + character.nivel * 50);
    character.nivel += 1;
    room.dialogue += "¡Has subido de nivel! Ahora eres nivel " + (character.nivel) + ".<br/>";
    let bonus = parseInt(1 + character.nivel / 10);
    room.dialogue += "¡Tus estadísticas aumentan en +" + bonus + "!<br/>";
    character.fuerza += 1;
    character.defensa += 1;
    character.destreza += 1;
    character.magia += 1;
    character.resistencia += 1;
    character.suerte += 1;
    character.vitalidad += 1;
    character.espiritu += 1;
    restaurar();
}

function tomarObjeto(compra, objeto) {
    let posible = true;
    let item = {};
    if (compra){
        item = objeto.product;
        if(character.oro >= item.precio && objeto.stock) {
            posible = true;
            character.oro += -item.precio;
        }else posible = false;
    }else item = objeto.item;
    if (posible) {
        switch (objeto.type) {
            case "equipment":
                switch (item.clase) {
                    case "cabeza":
                        character.equipo.cabeza = item;
                        break;

                    case "torso":
                        character.equipo.torso = item;
                        break

                    case "piernas":
                        character.equipo.piernas = item;
                        break

                    case "arma":
                    default:
                        character.equipo.arma = item;
                        break;
                }
                break;

            case "consumable":
            default:
                character.inventario.push(item);
                break;
        }
        objeto.stock = false;
    }

    session.character = character;
}

function restaurar() {
    room.dialogue += "Tus puntos de salud y de espíritu han sido restaurados por completo.";
    character.vida = (character.vitalidad + character.equipo.arma.estadisticas.vitalidad + character.equipo.cabeza.estadisticas.vitalidad + character.equipo.torso.estadisticas.vitalidad + character.equipo.piernas.estadisticas.vitalidad) * 5;
    character.energia = (character.espiritu + character.equipo.arma.estadisticas.espiritu + character.equipo.cabeza.estadisticas.espiritu + character.equipo.torso.estadisticas.espiritu + character.equipo.piernas.estadisticas.espiritu) * 5;
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