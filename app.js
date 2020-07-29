const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

//inicialize the app
const app = express();

//middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cors());

//use the passport middleware
app.use(passport.initialize());
//bring in the strategy created 
require('./config/passport')(passport);

//setting up the static directory
app.use(express.static(path.join(__dirname, 'public')));

//Bring in the database config and connect to the DB
const db = require('./config/keys').mongoURI;
const user = require('./config/keys').user;
const pass = require('./config/keys').pwd;
 
//clinica
//ClinicaPasswd
// mongodb+srv://clinica:<password>@cluster0-rmsvc.mongodb.net/<dbname>?retryWrites=true&w=majority

const MONGODB_URI = 'mongodb+srv://clinica:ClinicaPasswd@cluster0-rmsvc.mongodb.net/db?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI , {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
    console.log(`Database conected succesfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect to the database ${err}`)
});

//Bring in the Users route
const users = require('./routes/api/users');
app.use('/api/users', users);

//Bring in the Sessions route
const sessions = require('./routes/api/sessions');
app.use('/api/sessions', sessions);


const levels = require('./routes/api/levels')
app.use('/api/levels', levels)


const figures = require('./routes/api/figures')
app.use('/api/figures', figures)


const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});





