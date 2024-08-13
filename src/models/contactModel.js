const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    nome:{
        type: String,
        required: true,
    },
    sobrenome: {
        type: String,
        default: ""
    },
    telefone: {
        type: Number,
    },
    email: {
        type: String,
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

const contactModel = mongoose.model("contact", contactSchema)

class Contact {
    constructor(body){
        this.body = body;
        this.listaDeContatos = []
        this.errors = []
        this.contact = null
    }

    async criarContatos(){
        try{
            this.validaDados()
            if(this.errors.length > 0) return

            await this.userExist()
            if(this.errors.length > 0) return

            this.checkRequiredFields()
            if(this.errors.length > 0) return

            this.contact = await contactModel.create(this.body)

        } catch(e){
            console.log(e)
        }
    }

    async listarContatos(){
        try{
            this.listaDeContatos = await contactModel.find().sort({"criadoEm": 1})
        } catch(e){
            console.log(e)
        }
        
    }


    validaDados(){
        if(!this.body){
            this.errors.push("Informe algum dado para adicionar um contato.")
            return
        }
        this.cleanData()
    }


    cleanData(){
        for(let key in this.body){
            if(typeof key !== "string"){
                this.body[key] = ""
            }
            this.body[key] = this.body[key].toLowerCase()
        }
    }

    checkRequiredFields(){
        if(!this.body.nome){
            this.errors.push("É necessário adicionar um nome para o contato.")
        }

        if(!this.body.telefone && !this.body.email){
            this.errors.push("Adicione um telefone ou e-mail para o novo contato.")
        }
    }

    async userExist(){

        try{
            const email = this.body.email;
            const telefone = this.body.telefone ;
            if(email){
                const userMail = await contactModel.findOne({email});
                if(userMail) this.errors.push(`"${email}" já cadastrado no usuário "${userMail.nome}"`);
            }

            if(telefone){
                const userFone = await contactModel.findOne({telefone});
                if(userFone) this.errors.push(`"${telefone}" já cadastrado no usuário "${userFone.nome}"`);
            }
        
        }catch(e){
            console.log(e)
            this.errors.push("ERRO: Não foi possivel adicionar o contato.")
        }

    }

    async findContact(id){
        if(!id) return this.errors.push("É preciso informar um ID para busca de contatos.");
        this.contact = await contactModel.findById(id)
        return this.contact
    }

    async UpdateContact(id){
        
        try{
            this.validaDados()
            if(this.errors.length > 0) return

            this.checkRequiredFields()
            if(this.errors.length > 0) return

            await contactModel.findByIdAndUpdate(id, this.body, {new:true})
        }catch(e){
            console.log(e)
        }
        
    }

    async deleteContact(id){
        if(!id) return this.errors.push("É preciso informar um ID para deletar um contatos.");
        
        try{
            const result = await contactModel.findByIdAndDelete({_id:id});
            if(!result) this.errors.push("Não foi possivel localizar e remover o contato com o ID informado")
        }catch(e){
            this.errors.push("Não foi possivel deletar o contato. Tente novamente.")
            console.log(e)
        }
    }
}

module.exports = Contact