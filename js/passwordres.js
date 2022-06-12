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
        /*
        *FUNCION PARA ENVIAR LOS DATOS DEL FORMULARIO A LA API
        */
       
       async function passwordres() {
        
            let response = await postPasswordres(objeto).then((data) => data);
            if (response == "error") {
                let error = "El usuario no se encuentra";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("#user").val("");
            }else if(response=="error2"){
                let error = "las contraseñas no coinciden";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("#password").val("");
                $("#password2").val("");
            }else if(user==""|pass==""|pass2==""){
                let error = "se requiere escribir todos los campos";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("#password").val("");
                $("#password2").val("");
            }
            else{
                let mensaje = "Contraseña cambiada correctamente.";
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