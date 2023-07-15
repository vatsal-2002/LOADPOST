const express = require('express');
const app = express();
const userRoute = require('./api/routes/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// mongoose.connect('mongodb+srv://vatsalprajapati2002:HRqTKVoTxvZmgxQm@loadpost.edqp8pt.mongodb.net/?retryWrites=true&w=majority');
mongoose.connect("mongodb://localhost:27017/LoadPost",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},)
.then(() => console.log("connected with database"))
.catch((err) => {console.error(err); })

// mongoose.connection.on('error', err => {
//     console.log("connection failed");
// });

// mongoose.connection.on('connected', connected => {
//     console.log("connected with database");
// });

app.use(fileUpload({
    useTempFiles: true
}))

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRoute);

app.use((req, res, next) => {+
    res.status(404).json({
        erroe: 'Bed URL Request'
    })
})

module.exports = app;