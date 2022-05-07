$( document ).ready(function() {

  $(".desplegable").click(function (e) { 
    
    e.preventDefault();
    $(e.target).toggleClass("active");
    let panel = $(e.target).next();
    $(panel).toggle(450);

  });

});