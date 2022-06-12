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

        /*
        *FUNCION PARA ENVIAR LOS DATOS DEL FORMULARIO A LA API
        */
        async function signup() {
            //GUARDA LA RESPUESTA DEL SERVIDOR AL ENVIAR EL OBJETO EN UNA VARIABLE
            let response = await postSignup(objeto).then((data) => data);
            //EL USUARIO YA EXISTE 
            if (response == "error") {
                let error = "El usuario ya existe, inicia sesion.";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("#user").val("");
            //EL CORREO YA EXISTE
            }else if (response == "error2") {
                let error = "Ya existe una cuenta con ese email.";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("#email").val("");
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
            $("#password").val("");
            $("#password2").val("");
        } else if(password=="" || password2=="" || email=="" || user==""){
            let error = "Se requiere completar todos los campos.";
            $("#alerta").css("visibility", "visible");
            $("#alerta").html(error);
        }else if(!validarEmail(email)){
            let error = "El correo no es válido.";
            $("#alerta").css("visibility", "visible");
            $("#alerta").html(error);
            $("#email").val("");
        }
        else{
            //SI TODO ES CORRECTO LLAMA A LA FUNCION 
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
function validarEmail(email) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(email);
};
