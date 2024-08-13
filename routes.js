const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeControllers")
const loginController = require("./src/controllers/loginControllers")
const userpageController = require("./src/controllers/userpageControllers")

const {userIsRequired} = require("./src/middlewares/middlewareGlobal")

//rotas da home
route.get("/",homeController.index);

//rotas de login
route.get(`/login-index`, loginController.index)
route.post(`/login-register`,loginController.register)
route.post(`/login-login`, loginController.userLogin)
route.get(`/login-logout`, loginController.userLogout)

//rotas userPage
route.get("/userpage-add", userIsRequired, userpageController.addGet)
route.post("/userpage-add", userIsRequired, userpageController.addPost)
route.get(`/userpage-editForm`, userIsRequired, userpageController.editContact)
route.post(`/userpage-edit`, userIsRequired, userpageController.updateContact)
route.get(`/userpage-delete`, userIsRequired, userpageController.deleteContact)


module.exports = route