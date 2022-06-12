$(document).ready(function () {
    /*
    *AL PULSAR EL BOTON SUBMIT HARA LO SIGUIENTE
    */
    $("#submit").on("click", function (event) {
        event.preventDefault();
        let user = $("#user").val();
        let objeto = {
            name: user
        };
        async function password() {
        
            let response = await postPassword(objeto).then((data) => data);

            if (response == "error") {
                let error = "El usuario no se encuentra.";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            }else{
                let mensaje = "Comprueba tu correo electrónico.";
                $("#alerta").css("background-color","green");
                $("#alerta").css("visibility","visible");
                $("#alerta").html(mensaje);
                
            }
        }
        password();
    });
});
/*
*FUNCION QUE HACE LLAMADA MEDIANTE POST A LA API
*/
async function postPassword(params) {
    let result;
    try {
        result = await $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://proyectodaw-api.herokuapp.com/passwordreq",
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