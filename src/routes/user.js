const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.post('/new',async(req,res) => {
  
    const user = new User(req.body)
     try {
     const token = user.generateAuthtoken() 
     await user.save()
     res.send({user,tokens})
    } catch(e) {
       res.status(500).send(e)
   }
})


router.get('/me',async(req,res) => {
    try{
        const user = User.findOne({email : req.})
    }
})

module.exports = router