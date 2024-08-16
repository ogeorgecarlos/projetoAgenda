//modules

require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const helmet = require("helmet");
const csrf = require("csurf");


const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");

const {localsVar, checkCsrfToken} = require("./src/middlewares/middlewareGlobal.js")
const routes = require("./routes.js")
const createSecretArray = require("./src/modules/genSecretArray.js")

mongoose.connect(process.env.CONNECTIONSTRING)
.then(()=>{
    app.emit("conectado")
})
.catch(e=> {
    console.log("erro na coneção com mongoose: " + e.message)
})


const optionsToSession = {
    secret: createSecretArray(),
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7, //7dias
        httpOnly: true,
        samesite: "lax",
    },
} //reduzir esse codigo
const sessionOption = session(optionsToSession) //reduzir esse codigo;

app.use(helmet())

app.use(sessionOption)//reduzir esse codigo;
app.use(flash())


//----Middlewares do express-----//
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//----Sets do express-----//
app.set(`views`, path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
const port = process.env.PORT || 3000;
//------------------------//



//----Nossos proprios middlewares-----//

app.use(csrf())
app.use(checkCsrfToken)
app.use(localsVar)
app.use(routes, express.static(path.resolve(__dirname, "public")))

//-----------------------------------//


app.on("conectado", ()=>{
    app.listen(port, ()=>{
        console.log(`Servidor rodando na porta ${port}`)
    })
})
