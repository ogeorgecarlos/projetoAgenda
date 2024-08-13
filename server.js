//modules

require("dotenv").config(); //Requiring envoirement variables to server.js
const path = require("path") // MOdulo para trabalhar com caminhos
const { urlencoded } = require("body-parser"); //funcao que faz o parse do body que vem no corpo das requisicoes
const express = require("express");  //Modulo Express
const app = express(); //Nova instancia de express
const mongoose = require("mongoose");
const helmet = require("helmet");
const csrf = require("csurf");

//ESTUDAR ISSO AQUI
const session = require("express-session");
const MongoStore = require("connect-mongo")//(session) pq foi retirado?;
const flash = require("connect-flash");

const {localsVar, checkCsrfToken} = require("./src/middlewares/middlewareGlobal.js")
const routes = require("./routes.js") //Importação do modulo de rotas da app

mongoose.connect(process.env.CONNECTIONSTRING)
.then(()=>{
    app.emit("conectado")
})



const sessionOption = session({
    secret: "secretKey",
    //store: new MongoStore({mongooseConnection: mongoose.connection}) //pq foi retirado?,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7, //define o tempo em que os cookies estaram salvos (no caso, 7 dias)
        httpOnly: true, //Nao permite que os cookies sejam acessados por js do lado do cliente
    },
});


app.use(helmet())

//ESTUDAR ISSO AQUI

app.use(sessionOption);
app.use(flash())
// const middlewareGlobal = require("./src/middlewares/middlewareGlobal")


//----Middlewares do express-----//
//Middleware que parsea o body qye vem no corpo da requisição.
//Exyrended:true , premite que objeto aninhados tambem sejam analisado e manpulaveis.
app.use(urlencoded({extended:true}))
app.use(express.json())

//----Sets do express-----//
//Configurando o caminho onde deverá ser procurada as "views" da app.
app.set(`views`, path.resolve(__dirname, "src", "views"));
//Configurando qual será o view engine para esse projeto.
app.set("view engine", "ejs");
//configurando porta padrão para a app
app.set("port", 3000)
//recuperando o valor da porta pre definida e atribuindo a variavel "port"
const port = app.get("port");
//------------------------//



//----Nossos proprios middlewares-----//

app.use(csrf())
app.use(checkCsrfToken)
app.use(localsVar)
app.use(routes, express.static(path.resolve(__dirname, "public")))

//-----------------------------------//


//definindo o listen para inicio do servidor.

app.on("conectado", ()=>{
    app.listen(port, ()=>{
        console.log(`Servidor rodando na porta ${port}`)
    })
})
