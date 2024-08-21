const Login = require("../models/loginModel") 

exports.index = (req, res) =>{ 
    res.render(`login`)
};

exports.register = async (req, res) => {
    try{
        const body = req.body
        const login = new Login(body)
        await login.register();
        if(login.errors.length > 0){
            req.flash("errors", login.errors)
            req.session.save(() => res.redirect("/login-index"));
            return
        }
        req.flash("success", "Usuário cadastrado com sucesso!")
        req.session.save(() => res.redirect("/login-index"))
    }catch(e){
        console.log(e)
        res.render("404")
    }
};

exports.userLogin = async (req, res) => {
    try{
        const login = new Login(req.body)
        await login.enter()

        if(login.errors.length > 0){
            req.flash("errors", login.errors)
            req.session.save(() => res.redirect("/login-index"));
            return
        }

        req.flash("success", "Você entrou no sistema")
        req.session.user = login.user
        req.session.lastAccess = new Date()
        req.session.userMail = req.body.email
        req.session.save(() => res.redirect("/"))

    }catch(e){
        console.log(e)
        res.render("404")
    }
}

exports.userLogout = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}