/*
 Mongodb declaration and mongoose connection
*/

const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/accident-detector' ,{
    useNewUrlParser :true,
    useCreateIndex : true,
    useUnifiedTopology: true
})