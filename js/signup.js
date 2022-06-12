$(document).ready(function () {
    /*
    *AL PULSAR EL BOTON SUBMIT HACE LO SIGUIENTE 
    */
   $("#submit").on("click", function (event) {
        event.preventDefault();
        //GUARDA LOS VALORES DE EL FORMULARIO EN UN OBJETO
        let user = $("#user").val();
        let password = $("#password").val();
        let password2 = $("#password2").val();
        let email = $("#email").val();
        let objeto = {
            name: user,
            password: password,
            email: email
        };
        //FUNCION PARA ENVIAR LOS DATOS DEL FORMULARIO A LA API
        async function signup() {
            //GUARDA LA RESPUESTA DEL SERVIDOR AL ENVIAR EL OBJETO EN UNA VARIABLE
            let response = await postSignup(objeto).then((data) => data);
            //EL USUARIO YA EXISTE 
            if (response == "error") {
                let error = "El usuario ya existe, inicia sesion";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            //EL CORREO YA EXISTE
            }else if (response == "error2") {
                let error = "Ya existe una cuenta con ese email";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            } else {
                //GUARDA LA SESSION ENVIADA DESDE LA BBDD EN LOCALSTORAGE
                localStorage.setItem("session", response);
                //TE REDIRIGE A EL INICIO
                $(location).attr("href", "../");
            }
        }
        //SI LAS CONTRASEÑAS NO COINCIDEN 
        if (password2 != password) {
            let error = "Las contraseñas no coinciden";
            $("#alerta").css("visibility", "visible");
            $("#alerta").html(error);
            $("form")[0].reset();
        } else {
            //SI LAS CONTRASEÑAS COINCIDEN LLAMA A LA FUNCION 
            signup();
        }
    });
});

/*
*FUNCION QUE ENVIA LOS DATOS A LA API MEDIANTE METODO POST 
*/
async function postSignup(params) {
    let result;
    try {
        result = await $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://proyectodaw-api.herokuapp.com/signup",
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
