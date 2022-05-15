$( document ).ready(function() {
 


  $(".desplegable").click(function (e) { 
    
    e.preventDefault();
    $(e.target).toggleClass("active");
    let panel = $(e.target).next();
    $(panel).toggle(450);

  });
  generarBotones();

  function generarBotones(){
    let output = "";
    ayudas.forEach(categoria => {
      output += '<div class="caja" >'+categoria.titulo+'</div>'
    });
    $("#container").html(output);

  };

});