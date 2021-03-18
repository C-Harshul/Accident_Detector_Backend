const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    number : {
        type : String,
        unique: true,
        validate(value) {
            if(!validator.isMobilePhone(value)) {
                throw new Error('Phone number is invalid')
            }
        } 
    },
    email : {
        type: String,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    notifyContacts : [{
       contact_ID : {
           type: mongoose.Schema.Types.ObjectId,
           ref : 'Contact'
       }
    }],
    hospitals : [{
        hospital : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital'
        }
    }],
    password : {
        type : String,
        trim : true,
        required : true
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    },
  
},{
    timestamps : true
})

const User = mongoose.model('User',userSchema)

module.exports = User