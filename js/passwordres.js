$(document).ready(function () {
    
    /*
    *AL PULSAR EL BOTON SUBMIT HARA LO SIGUIENTE
    */
    $("#submit").on("click", function (event) {
        event.preventDefault();
        let user = $("#user").val();
        let pass = $("#password").val();
        let pass2 = $("#password2").val();
        let objeto = {
            name: user,
            password: pass,
            password2:pass2
        };
        async function passwordres() {
        
            let response = await postPasswordres(objeto).then((data) => data);
     
            if (response == "error") {
                let error = "El usuario no se encuentra";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            }else if(password2!=password){
                let error = "las contraseñas no coinciden";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            }else{
                let mensaje = "contraseña cambiada correctamente";
                $("#alerta").css("background-color","green");
                $("#alerta").css("color","white");
                $("#alerta").css("visibility","visible");
                $("#alerta").html(mensaje);
                $(location).attr('href','../');
            }
        }
        passwordres();
    });
});

/*
*FUNCION QUE HACE LLAMADA MEDIANTE POST A LA API
*/
async function postPasswordres(params) {
    let result;
    try {
        result = await $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://proyectodaw-api.herokuapp.com/passwordres",
            data: JSON.stringify(params),
            success: function (data) {
                result = data;
            },
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}