const Contacts = require("../models/contactModel")

exports.addGet = (req, res) => {

    res.locals.contato = {}
    res.render("addContacts.ejs")

}

exports.addPost = async (req, res) => {

    const body = req.body
    const contacts = new Contacts(body)

    try{
        await contacts.criarContatos()

        if(contacts.errors.length > 0){
            req.flash("errors", contacts.errors);
            req.session.save(()=>{
                res.redirect("/userpage-add")
            })
            return
        }

        req.flash("success", "Contato salvo com sucesso.");
        req.session.save(()=>{
            res.redirect("/userpage-add")
        })

    }catch(e){
        console.log(e)
    }
}

exports.editContact = async (req, res) => {

    try{
        const contacts = new Contacts()
        res.locals.contato = await contacts.findContact(req.query.id)
        res.render("addContacts")
    }catch(e){
        console.log(e)
    }
}

exports.updateContact = async (req, res) => {

    try{
        const contacts = new Contacts(req.body);
        await contacts.UpdateContact(req.query.id)

        if(contacts.errors.length > 0){
            req.flash("errors", contacts.errors);
            req.session.save(()=>{
                res.redirect(`/userpage-editForm?id=${req.query.id}`)
                return
            })
            return
        }

        req.flash("success", `Contato "${req.body.nome}" atualizado com sucesso`)
        req.session.save(()=>{
            res.redirect("/")
        })
    }catch(e){
        console.log(e)
    }
}

exports.deleteContact = async (req, res) => {

    try{
        const contacts = new Contacts()
        const contatoRemovido = await contacts.deleteContact(req.query.id)
        req.flash("success", `Contato removido com sucesso`)
        req.session.save(()=>{
            res.redirect("/")
        })
    }catch(e){
        req.flash("errors", `Erro ao remover o contato.`)
        req.session.save(()=>{
            res.redirect("/")
        })
        console.log(e)
    }
}