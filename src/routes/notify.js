const express = require('express')
const firebase = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')
const router = new express.Router()
const mongoose = require('mongoose')
const Contact = require('../models/contact')
const User = require('../models/user')

const auth = require('../middleware/auth')
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://driveguard-22dfb.firebaseio.com"
  });

//Sign Up new User
router.get('/contacts',auth,async(req,res) => {

  const user = req.user
  console.log(user.notifyContacts) 
  const tokens = await getContactTokens(user)   
  let payload = {
    notification : {
      title : 'SOS',
      body : "Harshul's car has met with an accident",
    },
    data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        message: 'Sample Push Message'
     
      },
    };
  var options = {
    priority : "high",
  }
  
  firebase.messaging().sendToDevice(tokens,payload,options)
  .then((response) => {
    console.log('Message sent successfully' ,response)
    res.send(response)
  }).catch((error) => {
    console.log(error)
    res.status(500).send()
  })
    
})

const getContactTokens = async (user) => {

  let tokens = []
  for(let i = 0; i<user.notifyContacts.length;++i) {
     const id = user.notifyContacts[i]._id
     console.log(id)
     const contactUser = await User.findById(id)
     contactUser.notificationTokens.forEach(token => {
       tokens.push(token.token)
     })

   }
   console.log(tokens)
   return tokens
}

module.exports = router
