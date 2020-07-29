const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Figure = require('./Figure');
//const autoIncrement = require('mongoose-auto-increment');

//description is the image class 
//number is the number of images of that class
const ClassSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})


const ImageSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
})



//Create the user schema
const LevelSchema = new Schema({
    number: {
        type: String,
        required: true
    }
    ,
    //Question number and classes of images
    question:{
        type: String,
        required: true
    },
    goodTime:{
        type: String,
        required: true
    },
    mediumTime:{
        type: String,
        required: true
    },
    badTime:{
        type: String,
        required: true
    },
    //images id array -> connects to the figures collection
    images:[ImageSchema],
    //Class/number object to answer the question
    classes:[ClassSchema]
});


//LevelSchema.plugin(autoIncrement.plugin, { model: 'Level', field: 'number',startAt: 1, incrementBy: 1});

module.exports = Level = mongoose.model('levels', LevelSchema);
