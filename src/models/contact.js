/*
  Contact model 
*/

const mongoose = require('mongoose')
const { default: validator } = require('validator')


//contact Schema defintion
const contactSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    phoneNumber : {
        type: String,
        required : true,
        validate(value) {
            if(!validator.isMobilePhone(value)){
             throw new Error('Phone number invalid')
            } 
        }
    },
    email : {
        type: String,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }
})

const Contact = mongoose.model('Contact',contactSchema)

module.exports = Contact