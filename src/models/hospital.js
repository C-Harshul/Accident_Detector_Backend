const mongoose = require('mongoose')
const { default: validator } = require('validator')

const hospitalSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    phoneNumber : {
        type : String,
        validate(value) {
            if(!validator.isMobilePhone(value)) {
                throw new Error('Phone number invalid')
            }
        }
    },
    address : {
        type : String,
    },
    location : {
        type : String
    }
})

const Hospital = mongoose.model('Hospital',hospitalSchema)

module.exports = Hospital