const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create a level schema
const LevelSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    attempts: {
        type: String,
        required: true
    }
})




//Create the user schema
const UserSchema = new Schema({
    //user email
    email:{
        type: String,
        required: true
    },
    //user password
    password:{
        type: String,
        required: true
    },
    //sessions id's list
    sessions:[String],
    //levels/score map
    levels:[LevelSchema]
});

// const AdminCase = mongoose.model('User',UserSchema)

// const admin = {
//     email: "admin@cli.com",
//     password: "$2a$10$iM0IxsuNtoYo5kEMKZLe3e/uJrtGqqhHDtg8tE7FQaQrqQD2X4n42",
//     levels: [],
//     sessions:[]
// }

// const myAdmin = new AdminCase(admin)

// myAdmin.save((error) => {
//     if(error){
//         console.log('Admin not added - Something went wrong')
//     } else {
//         console.log('Admin added')
//     }
// })

module.exports = User = mongoose.model('users', UserSchema);
