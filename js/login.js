$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();
        let user = $("#user").val();
        let password = $("#password").val();
        let objeto = {
            name: user,
            password: password,
        };
        async function login() {
            let response = await postLogin(objeto).then((data) => data);
            //console.log(response);
            if (response == "error") {
                let error = "Usuario o contraseña no coinciden";
                $("#alerta").css("visibility","visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            } else {
                sessionStorage.setItem("session", response);
                $(location).attr('href','../');
            }
        }
        login();
    });
});

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
