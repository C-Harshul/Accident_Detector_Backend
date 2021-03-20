const mongoose = require('mongoose')
const { default: validator } = require('validator')

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
    },
    appUser : {
        id : {
            type: mongoose.Schema.Types.ObjectId
        },
        notificationTokens : [{
            token:{
                type : String
            }
        }]
    }
})

const Contact = mongoose.model('Contact',contactSchema)

module.exports = Contact