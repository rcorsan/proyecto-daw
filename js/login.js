$(document).ready(function () {
    //AL PULSAR EL BOTON SUBMI HARA LO SIGUIENTE
    $("#submit").on("click", function (event) {
        event.preventDefault();
        //GUARDA LOS DATOS PASADOS EN EL FORMULARIO EN UN OBJETO
        let user = $("#user").val();
        let password = $("#password").val();
        let objeto = {
            name: user,
            password: password,
        };
        //FUNCION PARA ENVIAR LOS DATOS DEL FORMULARIO A LA API
        async function login() {
            //GUARDA LA RESPUESTA DEL SERVIDOR AL ENVIAR EL OBJETO EN UNA VARIABLE
            let response = await postLogin(objeto).then((data) => data);
            //SI EL USUARIO YA EXITE 
            if (response == "error") {
                let error = "Usuario o contraseña no coinciden";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            } else {
                //GUARDA LA SESSION ENVIADA DESDE LA BBDD EN LOCALSTORAGE
                localStorage.setItem("session", response);
                $(location).attr('href','../');
            }
        }
        login();
    });
});

//FUNCION QUE LLAMA A LA API MEDIANTE POST PARA ENVIAR LOS DATOS PASADOS EN EL FORMULARIO 
async function postLogin(params) {
    let result;
    try {
        result = await $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "https://proyectodaw-api.herokuapp.com/login",
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
