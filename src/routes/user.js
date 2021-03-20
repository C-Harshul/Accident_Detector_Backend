/*
   User routes
*/

const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const Contact = require('../models/contact')
const auth = require('../middleware/auth')

const router = new express.Router()

//Sign Up new User
router.post('/new',async(req,res) => {
    const user = new User(req.body)
    const _id = new mongoose.Types.ObjectId()
    user._id = _id
    const contact = new Contact({
        name : req.body.name,
        phoneNumber : req.body.number,
        email : req.body.email,
        appUser :{
            id : _id,
            notificationTokens : []
        }
    })
     try {
     await contact.save()    
     const token = await user.generateAuthtoken() 
     await user.save()
     res.send({user,token})
    } catch(e) {
       res.status(500).send(e)
   }
})

//Login user with credentials
router.post('/login',async (req,res) => {
    
    try{
    
        const user = await User.validateCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthtoken()
        res.send({user,token})
                  
    } catch(e) {
        res.status(404).send()  
    }

})

//Logout user from currently using device
router.get('/logout',auth,async(req,res) => {
    try{
        const currentToken = req.token
        const user = req.user
        let activeTokens = user.tokens
        activeTokens  = activeTokens.filter((token) =>{
            return token.token != currentToken
        })
        user.tokens = activeTokens
        await user.save()
        res.send(user)
    } catch(e) {
        console.log(e)
       res.status(500).send()
    }
})


//Logout user from all devices
router.get('/logoutall',auth,async(req,res) => {
    
    try{
       req.user.tokens= []
       await req.user.save()
       res.send()
    } catch(e) {
      res.status(500).send()
    }
})


//Get user profile
router.get('/me',auth,async(req,res) => {
    try{
        res.send(req.user)
    } catch(e) {
        res.status(500).send() 
    }
})



module.exports = router