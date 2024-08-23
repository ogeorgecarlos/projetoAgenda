const mongoose = require("mongoose");
const validator = require("validator"); 
const bcryptJs = require("bcryptjs")


//Schema login collection
const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
})

//Creating Login model
const loginModel = mongoose.model("login", loginSchema)


//this class will to manager all informations relationated to login: registers, logins.. etc.
class Login{
    constructor(body, lastAccess){
        this.body = body 
        this.errors = [] 
        this.user = null
        this.lastAccess = lastAccess
    }

    //Method to control new registers request
    async register(){
        await this.valida() //Check the entered datas
        if(this.errors.length > 0) return; // if error, stop and refuse the register

        if(await this.userExists(this.body.email));
            this.errors.push(`O usuário ${this.body.email} já está cadastrado.`)

        const hashPassword = this.genHashPassword(this.body.password) //Hashing the password
        if(this.errors.length > 0) return; // if error, stop and refuse the register

        this.body.password = hashPassword;

        try{
            this.user = await loginModel.create(this.body);
        }catch(e){
            console.log(e);
        }
    }

    //Method to control the logins request
    async enter(){
        try{
            await this.valida(); //Check entered datas
            if(this.errors.length > 0) return; // if error, stop and refuse the register

            if(! await this.userExists(this.body.email))
                return this.errors.push(`O usuário ${this.body.email} não está cadastrado.`)

            this.comparePassword(this.body.password);
            if(this.errors.length > 0) return;

        }catch(e){
            console.log(e);
        }
    }

    //Method to check entered Datas
    async valida(){ 
        this.cleanUp();

        if(!validator.isEmail(this.body.email)); //[alterar] Validacao do formato do email usando o validator (melhor seria com expressao regular)
            this.errors.push("e-mail inválido");
        
        if(this.body.password.length < 3  || this.body.password.length > 50); //[alterar] validacao do forma de senha (melhor seria com expressao regular.)
            this.errors.push("A senha precisa ter entre 3 e 50 caracteres");

    }

    cleanUp(){ //Method to "cleanUp the entered Datas before to check the format rules"

        for(let key in this.body){
            if( typeof this.body[key] !== "string"){
                this.body[key] = "";
            }
        }

        this.body = {
            email: this.body.email.toLowerCase(),
            password: this.body.password
        }
    }

    genHashPassword(password){
        try{
            const salt = bcryptJs.genSaltSync(10)
            const hash = bcryptJs.hashSync(password, salt)
            return hash
        }catch(e){
            this.errors.push("Não foi possivel protejer sua senha")
            console.log(e)
        }
    }

    comparePassword(data){
        const isMatch = bcryptJs.compareSync(data, this.user.password)
        if (!isMatch)
            this.errors.push("O password informado está incorreto")
    }

    async userExists(data){
        try{
            const user = await loginModel.findOne({email: data})
            if(user) {
                this.user = user
                return true
            }
        }catch(e){
            this.errors.push("Erro interno. Favor tentar novamente mais tarde.")
            console.log(e)
        }
        return false
    }

    static async criarIndex(campo){ //[Alterar e apagar] So a nivel de estudos de indexes em banco de dados.
        try{
            loginSchema.index(campo)
            await loginModel.collection.getIndexes({full:true})
        }catch(e){
            console.log(e)
        }
    }

}

Login.criarIndex({email: -1}) //[alterar???]
module.exports = Login 