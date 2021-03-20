const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}


userSchema.methods.generateAuthtoken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'UserToken')
    user.tokens = user.tokens.concat({token}) 
    await user.save()
    
    return token
}

userSchema.statics.validateCredentials = async(email,password) => {
   const user = await User.findOne({email})
   if(!user){
      throw new Error ('Invalid emailID')
   }
   const match = await bcrypt.compare(password,user.password)
   if(!match) {
       throw new Error('Incorrect password')
   }

   return user
}
 
userSchema.pre('save',async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User