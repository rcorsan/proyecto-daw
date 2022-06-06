let session={};
let character={};
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
    session = JSON.parse(localStorage.getItem('session'));
    if (session.playing){
        character = session.character;
    }else{
        character = new Character();
        session.character = character;
        session.playing = true;
    }
    console.log(character);
    localStorage.setItem('session', JSON.stringify(session));
    $("#index-grid").html(playerView()+dialogueView()+actionsView()+enemyView());
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
                "_id":"62935c6b54b43ed884414cfb",
                "id":400,
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
                "_id":"629e61c45dce1a4a45de18b1",
                "id":402,
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
                "_id":"629e62925dce1a4a45de18b2",
                "id":403,
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
                "_id":"629e685d5dce1a4a45de18b3",
                "id":404,
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

function playerView(){
    let view = "<div class='player'>";
    view += "<h1>" + session.name + "</h1>";
    view += "<h3>Nivel: " + character.nivel + "<br/>Experiencia: " + character.exp + "/" + (character.nivel + 1) * 50 + "</h3>";
    view += "<h4>Fuerza: " + character.fuerza + " + " + (character.equipo.arma.estadisticas.fuerza + character.equipo.cabeza.estadisticas.fuerza + character.equipo.torso.estadisticas.fuerza + character.equipo.piernas.estadisticas.fuerza) + " = " + (character.fuerza + character.equipo.arma.estadisticas.fuerza + character.equipo.cabeza.estadisticas.fuerza + character.equipo.torso.estadisticas.fuerza + character.equipo.piernas.estadisticas.fuerza);
    view += "<br/>Magia: " + character.magia + " + " + (character.equipo.arma.estadisticas.magia + character.equipo.cabeza.estadisticas.magia + character.equipo.torso.estadisticas.magia + character.equipo.piernas.estadisticas.magia) + " = " + (character.magia + character.equipo.arma.estadisticas.magia + character.equipo.cabeza.estadisticas.magia + character.equipo.torso.estadisticas.magia + character.equipo.piernas.estadisticas.magia);
    view += "<br/>Defensa: " + character.defensa + " + " + (character.equipo.arma.estadisticas.defensa + character.equipo.cabeza.estadisticas.defensa + character.equipo.torso.estadisticas.defensa + character.equipo.piernas.estadisticas.defensa) + " = " + (character.defensa + character.equipo.arma.estadisticas.defensa + character.equipo.cabeza.estadisticas.defensa + character.equipo.torso.estadisticas.defensa + character.equipo.piernas.estadisticas.defensa);
    view += "<br/>Resistencia: " + character.resistencia + " + " + (character.equipo.arma.estadisticas.resistencia + character.equipo.cabeza.estadisticas.resistencia + character.equipo.torso.estadisticas.resistencia + character.equipo.piernas.estadisticas.resistencia) + " = " + (character.resistencia + character.equipo.arma.estadisticas.resistencia + character.equipo.cabeza.estadisticas.resistencia + character.equipo.torso.estadisticas.resistencia + character.equipo.piernas.estadisticas.resistencia);
    view += "<br/>Destreza: " + character.destreza + " + " + (character.equipo.arma.estadisticas.destreza + character.equipo.cabeza.estadisticas.destreza + character.equipo.torso.estadisticas.destreza + character.equipo.piernas.estadisticas.destreza) + " = " + (character.destreza + character.equipo.arma.estadisticas.destreza + character.equipo.cabeza.estadisticas.destreza + character.equipo.torso.estadisticas.destreza + character.equipo.piernas.estadisticas.destreza);
    view += "<br/>Suerte: " + character.suerte + " + " + (character.equipo.arma.estadisticas.suerte + character.equipo.cabeza.estadisticas.suerte + character.equipo.torso.estadisticas.suerte + character.equipo.piernas.estadisticas.suerte) + " = " + (character.suerte + character.equipo.arma.estadisticas.suerte + character.equipo.cabeza.estadisticas.suerte + character.equipo.torso.estadisticas.suerte + character.equipo.piernas.estadisticas.suerte) + "</h4>";
    view += "</div>";
    return view;
}

function dialogueView(){
    let view = "<div class='dialogue'></div>";
    return view;
}

function actionsView(){
    let view = "<div class='actions'></div>";
    return view;
}

function enemyView(){
    let view = "<div class='enemy'></div>";
    return view;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}