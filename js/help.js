$( document ).ready(function() {
 


  $(".desplegable").click(function (e) { 
    
    e.preventDefault();
    $(e.target).toggleClass("active");
    let panel = $(e.target).next();
    $(panel).toggle(450);

  });
  generarBotones();

  function generarBotones(){
    var contenedor = document.getElementById('container');
    ayudas.forEach(categoria => {
      var caja = '<div class="caja" >'+categoria.titulo+'</div>'
       contenedor.innerHTML += caja;
    });
   
    

  };

});