const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const Contact = require('../models/contact')
const User = require('../models/user')
const mail = require('../notify/mail')
const appNotify = require('../notify/appUser')

const auth = require('../middleware/auth')

//Sign Up new User
router.get('/contacts',auth,async(req,res) => {

try{
  
  const user = req.user
  const tokens = await getContactTokens(user)   
  const mailids = await getMailIds(user)
  
  await mail("Harshul's car has met with an accident",mailids,(error,resp) => {
    if(error !== undefined) {
      console.log(resp)
      res.status(500).send(error)
    }
  })
  console.log('Mail sent')
  await appNotify(user.name,tokens)
  res.send()
  
} catch(e) {
  res.status(500).send(e)
}
 
    
})

const getMailIds = async (user) => {
  let mailids = []
  for(let i = 0; i<user.notifyContacts.length;++i) {
     const id = user.notifyContacts[i]._id
     const contactUser = await Contact.findById(id)
     if(contactUser !== null)
      mailids.push(contactUser.email)

   }
   return mailids
}

const getContactTokens = async (user) => {

  let tokens = []
  for(let i = 0; i<user.notifyContacts.length;++i) {
     const id = user.notifyContacts[i]._id
     console.log(id)
     const contactUser = await User.findById(id)
     if(contactUser !== null)
     contactUser.notificationTokens.forEach(token => {
       tokens.push(token.token)
     })

   }
   return tokens
}

module.exports = router
