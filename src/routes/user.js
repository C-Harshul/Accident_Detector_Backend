const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

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

router.post('/login',async (req,res) => {
    
    try{
    
        const user = await User.validateCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthtoken()
        res.send({user,token})
                  
    } catch(e) {
        res.status(404).send()  
    }

})

router.get('/logout',auth,(req,res) => {
    try{
        const currentToken = req.token
        const user = req.user
        const activeTokens = user.tokens
        activeTokens  = activeTokens.filter((token) =>{
            return token != currentToken
        })
        user.tokens = activeTokens
        await user.save()
        res.send(user)
    } catch(e) {
       res.status(500).send()
    }
})

router.get('/me',auth,async(req,res) => {
    try{
        res.send(req.user)
    } catch(e) {
        res.status(500).send() 
    }
})



module.exports = router