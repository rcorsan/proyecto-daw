let session={};
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
        console.log("Continuando partida");
    }else{
        console.log("Nueva partida");
        session.playing = true;
    }
    localStorage.setItem('session', JSON.stringify(session));
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