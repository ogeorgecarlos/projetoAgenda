const mongoose = require("mongoose")

const homeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    descricao: String
})

const homeModel = mongoose.model("home", homeSchema)

class Home{
    //faça algo
}

// module.exports = homeModel;