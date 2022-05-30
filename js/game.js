$( document ).ready(function() {
    sesioncompr();
}); //document ready

function sesioncompr(){
    if(sessionStorage){
        if(sessionStorage.length>0){
            $('#prueba').innerHTML(sessionStorage.getItem('sesion'));
        }
    }else{
        $('#prueba').innerHTML('no sesion');
    }
}