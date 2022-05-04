var jSalud = 40;
var eSalud = 32;
$( document ).ready(function() {
	$("#combate4").hide();
	$("#combate1").empty().append("Ataca para empezar a jugar!");
	$("#jSalud").empty().append("Salud:" + jSalud+ "/40");
	$("#eSalud").empty().append("Salud:" + eSalud+ "/32");

	$("#atacar").click(function() {
		$("#combate1").show();
		$("#combate2").hide();
		var crit = Math.floor((Math.random() * 100) + 1); //5 porciento critico
		console.log("crit % " + crit);

		if (crit >= 95) {
			var critDaño = Math.floor((Math.random() * 12) + 4); // look to see if crit first, then do normal dmg
			console.log("daño crítico " + critDaño);

			$("#combate1").empty().append("Golpe critico! Atacas con " + critDaño + " de daño!");
			eSalud -= critDaño;
			$("#eSalud").empty().append("Salud:" + eSalud+ "/32");

			eAttack(); 
			gameOver(); 

		} 
		else {
			var daño = Math.floor((Math.random() * 6) + 2); 
			console.log("daño " + daño);

			$("#combate1").empty().append("Atacas con " + daño + " de daño!");
			eSalud -= daño;
			$("#eSalud").empty().append("Salud:" + eSalud+ "/32");

			eAttack(); 
			gameOver(); 

		} //end attack else

	}); //attack
	$("#huir").click(function() {
		console.log("Decides Huir!");
		$("#combate2").empty().append("Huyes!");
		$("#combate4").show();
		$("#atacar,#habilidad,#huir").hide();
	});//huir

	$("#restart").click(function() {
		window.location.reload();
	}); //restart

	function gameOver() {
		if (jSalud <= 0 && eSalud <= 0) {
			$("#combate1").hide();
			$("#combate5").hide();
			$("#atacar,#habilidad,#huir").hide();
			$("#combate3").empty().append("Empate! Una pena que hayas muerto! Game Over!");
			$("#combate4").show();
		} else if (jSalud <= 0) {
			$("#combate1").hide();
			$("#combate5").hide();
			$("#atacar,#habilidad,#huir").hide();
			$("#combate3").empty().append("Moriste! Game Over!");
			$("#combate4").show();
		} else if (eSalud <= 0) {
			$("#combate1").hide();
			$("#combate5").hide();
			$("#atacar,#habilidad,#huir").hide();
			$("#combate3").empty().append("Felicidades! Ganas!");
			$("#combate4").show();
		}
	}; //gameOver

	

	function eAttack() { 
		var eDamage = Math.floor((Math.random() * 8) + 2);
		console.log("Ataque enemigo " + eDamage);

		$("#combate5").empty().append("El enemigo te ataca con " + eDamage + " de daño!");
		jSalud -= eDamage;
		$("#jSalud").empty().append("Salud:" + jSalud+ "/40");
	}; //eAttack

}); //document ready
