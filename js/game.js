let session={};
$(document).ready(function () {
    $("#play-button").click(function (e) { 
        e.preventDefault();
        console.log(sessionCompr());
        if(sessionCompr()){
            session = JSON.parse(localStorage.getItem('session'));
            
        }else{
            $(location).attr('href', "login");
        }
    });
});