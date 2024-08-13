import "core-js/stable";
import "regenerator-runtime/runtime";
import ValidFormLogin from "./modules/login"
import ValidFormCad from "./modules/cadastroUser"


//validação de formularios no back-End
const locationPage = document.location.pathname
switch(locationPage){
    case "/login-index":
        console.log("aqui1")
        const register = new ValidFormLogin("login-register")
        const login = new ValidFormLogin("login-login")
        register.init()
        login.init()
        break
    case "/userpage-add":
        const cadastroUser = new ValidFormCad("cadastro-user")
        cadastroUser.init()
        break
    case /\/userpage-editForm.*/:
        const editUser = new ValidFormCad("edit-user")
        editUser.init()
        break
    default:
        break
}


