const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create a level schema
const FigureSchema = new Schema({
    figURL: {
        type: String,
        required: true
    },
    figClass: {
        type: String,
        required: true
    }
})



module.exports = Figure = mongoose.model('figures', FigureSchema);
