/*
 Mongodb declaration and mongoose connection
*/

const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://Accident_Detection_Backend:Accident_Detection_Backend@cluster0.3czea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ,{
    useNewUrlParser :true,
    useCreateIndex : true,
    useUnifiedTopology: true
})