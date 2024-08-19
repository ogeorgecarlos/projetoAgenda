const Contacts = require("../models/contactModel")

exports.index = async (req, res) =>{
    try{
        const contacts = new Contacts(null, req.session.userMail)
        await contacts.listarContatos()
        const listaDeContatos = contacts.listaDeContatos
        res.locals.listaDeContatos = listaDeContatos
        res.render("index")
    }catch(e){
        console.log(e)
    }
}