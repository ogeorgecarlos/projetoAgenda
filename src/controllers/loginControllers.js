//Modulo de controller para a rota "login"´


const Login = require("../models/loginModel") //importacao do modulo login model que contem a logica de criação de usuarios

exports.index = (req, res) =>{ //lógica de rendenrizacao para a rota /login/index
    res.render(`login`)
};

exports.register = async (req, res) => { //logica de renderizacao para a rota /login/register
    try{
        const body = req.body
        const login = new Login(body) //instanciamos a classe login pertencente ao modulo "loginModel", que tem a finalidade de registar e processar a logica de criação de um novo usuário
        await login.register(); //Chamamento do método principal que regista novos usuario em banco de dados.
        if(login.errors.length > 0){
            //Se após o chamanmento d método register, houverem erros no array error da classe login
            //Então, savaremos um nova mensagem flash com o array de erros para feedback ao cliene.
            req.flash("errors", login.errors)

            //Após a mensagem de erro, redirecionamos o cliente para a página anterior
            //Mas antes do redirecionamento, por garantia salvamos a sessao.
            //Então, salvamos e como callbak da funcao save, redirecionamos o cliente.
            req.session.save(function(){
                return res.redirect("/login-index")
            });
            return
        }
        req.flash("success", "Usuário cadastrado com sucesso!")
        req.session.save(()=>{
            res.redirect("/login-index")
        })
    }catch(e){
        console.log(e)
        res.render("404")
    }
};

exports.userLogin = async (req, res) => {
    //devo excluir esse comentário
    try{
        if(!req.session.userMail) req.session.userMail = req.body.email
        const body = req.body
        const login = new Login(body)
        await login.enter()

        if(login.errors.length > 0){
            req.flash("errors", login.errors)
            //devo excluir esse comentario tambem
            req.session.save(function(){
                return res.redirect("/login-index")
            });
            return
        }

        req.flash("success", "Você entrou no sistema")
        req.session.user = login.user
        req.session.save(function (){
            return res.redirect("/")
        })

    }catch(e){
        console.log(e)
        res.render("404")
    }
}

exports.userLogout = (req, res) => {
    req.session.user = null
    res.redirect("/")
}