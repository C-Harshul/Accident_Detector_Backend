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
        appUser : _id
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

    const newDeviceToken = req.body.deviceToken
    
    try{
        const user = await User.validateCredentials(req.body.email,req.body.password)
        if(newDeviceToken == undefined) {
            user.notificationTokens.push({'token' : newDeviceToken})
        }                   
     
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

router.patch('/me',auth, async (req,res) => {

    const updates = Object.keys(req.body)
    const allowed = ['email','password','number']
    const isValidOperation= updates.every((update) => allowed.includes(update))
    if(!isValidOperation) {
        res.status(400).send()
    }

    try{
       
      updates.forEach((update) => {   
        console.log(req.body[update])  
        req.user[update] = req.body[update]
      })
      console.log(req.user)
      await req.user.save()
    
      res.send(req.user)

    } catch(e) {
      res.status(500).send()
    }

  })

router.delete('/me', auth,async (req,res) =>{
    console.log(req.user._id)
    try{
      const user = await User.findByIdAndDelete(req.user._id)
      const contact = await Contact.findByIdAndDelete(req.user._id)
      if(!user || !contact) {
         return res.status(404).send()
      }
      res.send(user)
    } catch(e) {
      res.status(500).send()  
    }
})


module.exports = router