exports.checkCsrfToken = (err, req, res, next) =>{
    if(err){
        console.log(err.message)
        res.render("404")
    }

    next()
}

exports.localsVar = (req,res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.user = req.session.user || undefined;
    next()
}

exports.userIsRequired = (req, res, next) => {
    if(!req.session.user) {
        req.flash("errors", "Você precisa está logado para acessar essa página.")
        req.session.save(()=>{
            res.redirect("/login/index")
        })
        return
    }
    next()
}

exports.pageNotFound = (req, res) => {
    res.status(404).render("404")
}