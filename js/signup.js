$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();
        let user = $("#user").val();
        let password = $("#password").val();
        let password2 = $("#password2").val();
        let email = $("#email").val();
        let objeto = {
            name: user,
            password: password,
            email: email
        };
        async function signup() {
            let response = await postSignup(objeto).then((data) => data);
            //console.log(response);
            if (response == "error") {
                let error = "El usuario ya existe, inicia sesion";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            }else if (response == "error2") {
                let error = "Ya existe una cuenta con ese email";
                $("#alerta").css("visibility", "visible");
                $("#alerta").html(error);
                $("form")[0].reset();
            } else {
                localStorage.setItem("session", response);
                $(location).attr("href", "../");
            }
        }

        if (password2 != password) {
            let error = "Las contraseñas no coinciden";
            $("#alerta").css("visibility", "visible");
            $("#alerta").html(error);
            $("form")[0].reset();
        } else {
            signup();
        }
    });
});

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
