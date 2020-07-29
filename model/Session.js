const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create the user schema
const SessionSchema = new Schema({

    //level played
    level:{
        type: String,
        required: true
    },
    //level was concluded
    finished:{
        type: Boolean,
        default: false
    },
    // score
    score:{
        type: String,
        default: 0
    },
    //date
    elapsetime:{
        type: String,
        default: 0
    },
    //date
    date:{
        type: Date,
        default: new Date()
    }
});

module.exports = Session = mongoose.model('sessions', SessionSchema);
