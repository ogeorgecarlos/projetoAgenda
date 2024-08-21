const mongoose = require("mongoose"); //importacao do mongoose para grenciamento dos dados recebidos na requisicao
const validator = require("validator"); //modulo com pre definicoes de validacao de dados
const bcryptJs = require("bcryptjs")


//Definicao do esquema para a colecao com dados do login
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

//criacao do modelo/colecao dos dados com schema pre definido
// No segundo argumento tambem poderia ter sido passado um objeto literal definindo o schema dos dados
const loginModel = mongoose.model("login", loginSchema)



class Login{ // classe com logica de validacao de dados para exportacao e uso pelo controller.
    constructor(body, userMail, lastAccess){
        this.body = body //corpo da requisicao
        this.errors = [] // um array quqe receberá erros encontrados e servirá como red flag para nao criação do usuário
        this.user = null // propriedade que referenciará o usuario, se criado.
        this.lastAccess = lastAccess
    }

    async register(){ //Método principal para registar o usuario apos o recebimento da requisicao POST
        await this.valida() // Método auxiliar que valida os dados recebidos antes de registar
        if(this.errors.length > 0) return // após os dados passar pelos metodos auxiliares, caso seja verificado erros , a funcao retorna sem incluir os dados da base de dados

        if(await this.userExists(this.body.email))
            this.errors.push(`O usuário ${this.body.email} já está cadastrado.`)

        const hashPassword = this.genHashPassword(this.body.password)

        if(this.errors.length > 0) return //Apos a decrypto da senha , caso haja erro.

        this.body.password = hashPassword

        try{ //bloco try catch para criar o novo documento dentro da coleção "login"
            this.user = await loginModel.create(this.body) //além de salvar o corpo da requisição já sanitizado, tambem atribui isso a propriedade user.
        }catch(e){
            console.log(e) // se erro, console.log do erro.
        }
    }

    async enter(){
        try{
            //validando formato da entrada de dados
            await this.valida()
            if(this.errors.length > 0) return

            // validando se usuário realmente existe na base de dados
            if(! await this.userExists(this.body.email))
                return this.errors.push(`O usuário ${this.body.email} não está cadastrado.`)

            //verificando se a senha digitada, é igual a senha do usario localizado na base de dados
            this.comparePassword(this.body.password)

            //confirmando que nao houve erros em validar usuário
            if(this.errors.length > 0) return


            // //verificando se usuário informado existe na base dados
            // const userExists = await this.userExists(this.body.email)
            // if(!userExists)
            //     return this.errors.push(`O usuário ${this.body.email} não está cadastrado.`);
        }catch(e){
            console.log(e)
        }
    }

    async valida(){ //Método auxliar odp processo de registro para validar os dados antes de concluir o salvamento
        this.cleanUp() // método auxiliar do método de validação: Sanitiza os dados antes de validar seu formato.
        //o e-mail precisa ser valido
        if(!validator.isEmail(this.body.email)) //Validacao do formato do email usando o validator (melhor seria com expressao regular)
            this.errors.push("e-mail inválido") //Se nao tiver formato de email, o array de erros fará o push da informacao de erro com email.
        //a senha precisa ter entre 3 e 50 char
        if(this.body.password.length < 3  || this.body.password.length > 50) //validacao do forma de senha (melhor seria com expressao regular.)
            this.errors.push("A senha precisa ter entre 3 e 50 caracteres") // Caso a senha nao tenha o formato minimo , o erro sera incluido no array que sinaliza erros.
        //O usuário existente precisa ser verificado
    }

    cleanUp(){ //Método auxiliar do metodo valida que sanitiza os dados antes de serem validados.
        for(let key in this.body){ //Itera sob as propriedade do body, verificando seus valores.
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

    static async criarIndex(campo){ //So a nivel de estudos de indexes em banco de dados.
        try{
            loginSchema.index(campo)
            await loginModel.collection.getIndexes({full:true})
        }catch(e){
            console.log(e)
        }
    }

}

Login.criarIndex({email: -1})

module.exports = Login //configuracao de permissao de exportacao da classe login.